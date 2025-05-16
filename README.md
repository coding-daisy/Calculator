# Calculator

Welcome to my interactive calculator, built as part of the curriculum of **The Odin Project**!

## Usage
Click the buttons to input numbers and perform calculations — just like with your regular calculator.
Hope it makes your math homework a bit easier!

## Calculator Behavior

### Displayed Number
- When inputting a number (by appending digits, "." or pressing "±"), this number is shown.
- When a binary operator is selected, the result of the preceding expression is shown.
- The default shown before any usage / after resetting the calculator is "0".

### Behavior after pressing "="
- Pressing an operator after "=" continues from the next calculation using the evaluated result.
- Pressing a digit, "." or "±" after "=" starts a new input, overwriting the result.

### Result Calculation
- The operations are used in the order they appear (rather than following standard operator precedence).
- If the length of the result of a calculation (excluding the optional "-" sign) exceeds the maximum length, "TOO LONG" is displayed.
- Division by 0 results in "ERROR".
- Any calculation involving "ERROR" or "TOO LONG" results in "ERROR".

### "AC"
- Pressing "AC" resets the calculator.

### "±"
- Pressing "±" toggles the current value between positive and negative.
- Behavior if "±" is used on an empty string...
    - directly after an operator other than "=", "-" is stored as the value, but not displayed. (This is an exception to behavior described in "Displayed Number")
    - directly after "=", "-0" is stored as the value and displayed.

### Appending Over the Limit
- If the length of the value (excluding the optional "-" sign) reaches the maximum length or the maximum number of decimal positions is reached, nothing is appended. This rule is absolute.

### "."
- Pressing "." adds a decimal point to create floating-point numbers.
- If the string to be appended to ...
    - already contains a ".", nothing is appended
    - is empty, the resulting string becomes "0."

### Appending to Zero
- If the current number is "0" or "-0", and the user appends an integer, the 0 is removed. If a "." is appended instead, the 0 is kept (e.g., becomes "0." or "-0.").

## Purpose
This project was created to apply the JavaScript basics learned during the **Foundations** course, including:
- Objects and arrays
- Loops and conditional logic
- Functions
- Flexbox-based layout
- Event handling and listeners
- DOM manipulation