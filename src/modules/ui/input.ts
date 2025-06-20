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
    return new Promise((resolve) => {
      this.commandResolve = resolve;
    });
  }
  
  validateCommand(command: string): boolean {
    return this.validCommands.includes(command.toUpperCase());
  }
  
  parseCommands(input: string): Command[] {
    const commands: Command[] = [];
    const parts = input.trim().split(/\s+/);
    
    for (const part of parts) {
      const upperPart = part.toUpperCase();
      if (this.validateCommand(upperPart)) {
        commands.push({
          id: uuidv4(),
          type: upperPart as any, // Cast to any to handle potential type mismatch
          timestamp: new Date(),
        });
      }
    }
    
    // Ensure we return at least one command if valid
    if (commands.length === 0 && parts.length > 0) {
      console.warn(`Invalid command: ${input}`);
    }
    
    return commands;
  }
  
  close(): void {
    // No resources to clean up in this implementation
  }
}
