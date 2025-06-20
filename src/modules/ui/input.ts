import { IInput } from './input.interface';
import { Command } from '../rover/rover-types.interface';
import { v4 as uuidv4 } from 'uuid';

export class CommandInput implements IInput {
  private inputElement: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private validCommands = ['Z', 'S', 'Q', 'D', 'scan', 'return'];
  private commandResolve: ((value: Command) => void) | null = null;
  
  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID ${containerId} not found`);
    }
    
    // Create input form
    const form = document.createElement('form');
    form.className = 'command-form';
    form.style.cssText = `
      display: flex;
      margin-top: 20px;
      background-color: #1a1a1a;
      padding: 10px;
      border: 1px solid #444;
    `;
    
    // Create input element
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.placeholder = 'Enter commands (Z, S, Q, D, scan, return)';
    this.inputElement.style.cssText = `
      flex: 1;
      padding: 8px;
      background-color: #2a2a2a;
      color: #00ff00;
      border: none;
      font-family: monospace;
    `;
    
    // Create submit button
    this.submitButton = document.createElement('button');
    this.submitButton.type = 'submit';
    this.submitButton.textContent = 'Send';
    this.submitButton.style.cssText = `
      padding: 8px 16px;
      background-color: #444;
      color: #00ff00;
      border: none;
      margin-left: 10px;
      cursor: pointer;
    `;
    
    form.appendChild(this.inputElement);
    form.appendChild(this.submitButton);
    container.appendChild(form);
    
    // Add event listener
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.commandResolve) {
        const command = this.parseCommands(this.inputElement.value)[0];
        if (command) {
          this.commandResolve(command);
          this.inputElement.value = '';
        }
      }
    });
  }
  
  async captureUserInput(): Promise<Command> {
    return new Promise<Command>((resolve) => {
      // Store the resolver to be called when form is submitted
      this.commandResolve = () => {
        // Return a valid command object with the first command as the type
        // We'll use a placeholder valid type, and the actual processing will happen in parseCommands
        resolve({
          id: uuidv4(),
          type: 'Z', // Use a valid type from the union
          parameters: { rawInput: this.inputElement.value }, // Store the full input string in parameters
          timestamp: new Date()
        });
      };
    });
  }
  
  validateCommand(command: string): boolean {
    return this.validCommands.includes(command.toUpperCase());
  }
  
  parseCommands(input: string): Command[] {
    const commands: Command[] = [];
    const inputUpper = input.trim().toUpperCase();
    
    // Process each character as a separate command
    for (let i = 0; i < inputUpper.length; i++) {
      const char = inputUpper[i];
      
      // Handle single-character commands
      if (['Z', 'S', 'Q', 'D'].includes(char)) {
        commands.push({
          id: uuidv4(),
          type: char as 'Z' | 'S' | 'Q' | 'D', // Explicitly cast to valid command type
          timestamp: new Date(),
        });
      } else if (char === ' ') {
        // Skip spaces
        continue;
      } else {
        // Special handling for multi-character commands
        if (i + 4 <= inputUpper.length && inputUpper.substring(i, i + 4) === 'SCAN') {
          commands.push({
            id: uuidv4(),
            type: 'scan',
            timestamp: new Date(),
          });
          i += 3; // Skip the rest of "scan"
        } else if (i + 6 <= inputUpper.length && inputUpper.substring(i, i + 6) === 'RETURN') {
          commands.push({
            id: uuidv4(),
            type: 'return',
            timestamp: new Date(),
          });
          i += 5; // Skip the rest of "return"
        } else {
          console.warn(`Invalid command character: ${char}`);
        }
      }
    }
    
    return commands;
  }
  
  close(): void {
    // No resources to clean up in this implementation
  }
}
