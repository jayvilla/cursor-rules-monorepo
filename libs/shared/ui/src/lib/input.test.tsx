import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('should render input', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should forward aria props', () => {
    render(<Input aria-label="Test input" aria-required="true" />);
    const input = screen.getByLabelText('Test input');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('should handle value changes', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply error styling when error prop is true', () => {
    render(<Input error data-testid="error-input" />);
    const input = screen.getByTestId('error-input');
    expect(input).toHaveClass('border-accent');
  });
});

