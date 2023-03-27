// Write your tests here
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppFunctional from './AppFunctional';
import '@testing-library/jest-dom/extend-expect';



test('renders whithout errors', () => {
  render(<AppFunctional />);
});

test('Render Button id ', () => {
  render(<AppFunctional />);

  const buttonRight = screen.getByText(/RIGHT/i);
  const buttonLeft = screen.queryByText(/left/i);
  const buttonUp = screen.queryByText(/up/i);
  const buttonDown = screen.queryByText(/down/i);

  expect(buttonRight).toBeInTheDocument();
  expect(buttonLeft).toBeInTheDocument();
  expect(buttonDown).toBeInTheDocument();
  expect(buttonUp).toBeInTheDocument();

  expect(buttonRight).toBeTruthy();
  expect(buttonLeft).toBeTruthy();
  expect(buttonDown).toBeTruthy();
  expect(buttonUp).toBeTruthy();

  expect(buttonRight).toHaveTextContent(/right/i);
  expect(buttonLeft).toHaveTextContent(/left/i);
  expect(buttonDown).toHaveTextContent(/down/i);
  expect(buttonUp).toHaveTextContent(/up/i); 
});

test('render input Label', () =>{
  render(<AppFunctional />);

  const inputLabel = screen.getByPlaceholderText("Type email");
  const testEmail = "alejandrohussein1@gmail.com";

  expect(inputLabel).toBeInTheDocument();
  expect(inputLabel).toBeTruthy();

  fireEvent.change(inputLabel, {target: {value: testEmail}});
  expect(inputLabel.value).toBe(testEmail)
});

test('render Submit', () => {
  render(<AppFunctional />);

  const submit =screen.getByText(/submit/i);

  expect(submit).toBeInTheDocument();
});




// test('sanity', () => {
//   expect(true).toBe(false)
// })
