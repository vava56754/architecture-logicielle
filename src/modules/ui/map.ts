import { IMap } from './map.interface';
import { Position, Obstacle, Orientation } from '../rover/rover-types.interface';

export class MapDisplay implements IMap {
  private mapElement: HTMLElement;
  private currentPosition: Position = { x: 0, y: 0, z: 0 };
  private currentObstacles: Obstacle[] = [];
  private currentOrientation: Orientation = { orientation: 'N' };
  private mapSize = 20; // 20x20 grid
  private roverPath: Position[] = []; // Track rover's path
  
  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID ${containerId} not found`);
    }
    
    this.mapElement = document.createElement('div');
    this.mapElement.className = 'rover-map';
    this.mapElement.style.cssText = `
      position: relative;
      width: 100%;
      height: 400px;
      background-color: #1a1a1a;
      border: 2px solid #444;
      overflow: hidden;
    `;
    
    container.appendChild(this.mapElement);
    
    // Initialize rover path with starting position
    this.roverPath.push({ ...this.currentPosition });
  }
  
  updateMap(position: Position, obstacles: Obstacle[], orientation?: Orientation): void {
    // Add position to path if it's different from the current position
    const isDifferentPosition = 
      this.currentPosition.x !== position.x || 
      this.currentPosition.y !== position.y || 
      this.currentPosition.z !== position.z;
    
    if (isDifferentPosition) {
      this.roverPath.push({ ...position });
      // Limit path length to prevent performance issues
      if (this.roverPath.length > 100) {
        this.roverPath.shift();
      }
    }
    
    this.currentPosition = position;
    this.currentObstacles = obstacles;
    if (orientation) {
      this.currentOrientation = orientation;
    }
    
    this.displayMap();
  }
  
  displayMap(): void {
    this.mapElement.innerHTML = '';
    
    // Create grid
    const gridElement = document.createElement('div');
    gridElement.className = 'map-grid';
    gridElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(${this.mapSize}, 1fr);
      grid-template-rows: repeat(${this.mapSize}, 1fr);
    `;
    
    // Calculate center offset to make the rover position centered
    const offsetX = Math.floor(this.mapSize / 2) - this.currentPosition.x;
    const offsetY = Math.floor(this.mapSize / 2) - this.currentPosition.y;
    
    // Create a 2D grid to track what's in each cell
    const grid = Array(this.mapSize).fill(0).map(() => Array(this.mapSize).fill(null));
    
    // Add grid cells
    for (let y = 0; y < this.mapSize; y++) {
      for (let x = 0; x < this.mapSize; x++) {
        const actualX = x - offsetX;
        const actualY = this.mapSize - 1 - y - offsetY; // Invert Y for correct display
        
        const cell = document.createElement('div');
        cell.className = 'map-cell';
        cell.dataset.x = String(actualX);
        cell.dataset.y = String(actualY);
        cell.style.cssText = `
          border: 1px solid #333;
          position: relative;
        `;
        
        // Add coordinates to each cell
        const coords = document.createElement('span');
        coords.className = 'coords';
        coords.textContent = `${actualX},${actualY}`;
        coords.style.cssText = `
          position: absolute;
          font-size: 8px;
          color: #555;
          bottom: 2px;
          right: 2px;
        `;
        cell.appendChild(coords);
        
        // Store the cell in our grid
        const gridX = x;
        const gridY = y;
        if (gridX >= 0 && gridX < this.mapSize && gridY >= 0 && gridY < this.mapSize) {
          grid[gridY][gridX] = cell;
        }
        
        // Check if this is part of the rover's path
        const isInPath = this.roverPath.some(pos => 
          this.toroidalEquals(pos.x, actualX, this.mapSize/2) && 
          this.toroidalEquals(pos.y, actualY, this.mapSize/2)
        );
        
        if (isInPath) {
          const pathMarker = document.createElement('div');
          pathMarker.className = 'path-marker';
          pathMarker.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            background-color: rgba(0, 255, 0, 0.3);
            border-radius: 50%;
          `;
          cell.appendChild(pathMarker);
        }
        
        // Check if this cell contains an obstacle - only show discovered obstacles
        const obstacle = this.currentObstacles.find(o => 
          this.toroidalEquals(o.position.x, actualX, this.mapSize/2) && 
          this.toroidalEquals(o.position.y, actualY, this.mapSize/2) &&
          o.discovered
        );
        
        if (obstacle) {
          cell.style.backgroundColor = '#8B4513';
          cell.title = `Obstacle (size: ${obstacle.size})`;
        }
        
        // Check if this is the rover's position
        if (this.toroidalEquals(actualX, this.currentPosition.x, this.mapSize/2) && 
            this.toroidalEquals(actualY, this.currentPosition.y, this.mapSize/2)) {
          const rover = document.createElement('div');
          rover.className = 'rover';
          rover.textContent = this.getOrientationArrow();
          rover.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #00ff00;
            z-index: 10;
          `;
          cell.appendChild(rover);
        }
        
        gridElement.appendChild(cell);
      }
    }
    
    this.mapElement.appendChild(gridElement);
    
    // Add a legend
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    legend.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 10px;
      background-color: rgba(0,0,0,0.7);
      padding: 5px;
      border: 1px solid #444;
      font-size: 12px;
    `;
    
    // Update legend to show only generic obstacles
    legend.innerHTML = `
      <div><span style="color: #00ff00;">${this.getOrientationArrow()}</span> Rover</div>
      <div><span style="color: rgba(0,255,0,0.3);">●</span> Path</div>
      <div><span style="color: #8B4513;">■</span> Obstacle</div>
    `;
    
    this.mapElement.appendChild(legend);
  }
  
  // Helper function for toroidal comparison
  private toroidalEquals(a: number, b: number, mapRadius: number): boolean {
    // In a toroidal space, we need to check if they're equal in wrapped space
    const modA = ((a % (mapRadius * 2)) + (mapRadius * 2)) % (mapRadius * 2);
    const modB = ((b % (mapRadius * 2)) + (mapRadius * 2)) % (mapRadius * 2);
    return modA === modB;
  }
  
  private getObstacleColor(type: string): string {
    // All obstacles are the same color now
    return '#8B4513';
  }
  
  private getOrientationArrow(): string {
    switch (this.currentOrientation.orientation) {
      case 'N': return '↑';
      case 'E': return '→';
      case 'S': return '↓';
      case 'W': return '←';
      default: return '•';
    }
  }
}
