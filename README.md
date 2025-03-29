# Macro Calculator

A personalized macro nutrition calculator built with Next.js that helps users determine their ideal macronutrient intake based on their body metrics, activity level, and fitness goals.

## Features

- Calculate Basal Metabolic Rate (BMR) based on age, gender, height, and weight
- Support for both metric (cm/kg) and imperial (in/lbs) units
- Adjust calculations based on activity level, including detailed weightlifting and cardio inputs
- Calculate macronutrient distributions (protein, carbs, fat) based on fitness goals
- Visual representation of macro breakdown
- Responsive design for all devices

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework with App Router
- [React](https://react.dev/) - UI library
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/macro-calc.git
   cd macro-calc
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

The calculator takes various inputs including:

- Personal metrics (age, gender, height, weight)
- Body fat percentage (optional)
- Activity level
- Exercise details (weightlifting and cardio)
- Fitness goals

It then calculates your:

- Basal Metabolic Rate (BMR)
- Lean Body Mass (LBM)
- Total Daily Energy Expenditure (TDEE)
- Optimal macronutrient distribution based on your selected goal

## Calculation Methods

The calculator uses the following mathematical formulas:

### Basal Metabolic Rate (BMR)

Uses the Mifflin-St Jeor equation:

- **Male**: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age)
- **Female**: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.33 × age)

### Lean Body Mass (LBM)

- If provided directly: Uses user input
- If body fat % provided: LBM = (1 - BF/100) × weight in kg
- Default estimates: 15% body fat for males, 25% for females

### Total Daily Energy Expenditure (TDEE)

TDEE = BMR × Activity Multiplier + Exercise Calories

Where Activity Multiplier is calculated from:

- Job activity level (sedentary to very active)
- Workout frequency, duration, and intensity

### Goal-Based Calorie Adjustment

- **Weight Gain**: Calories = TDEE × 1.15 (15% surplus)
- **Weight Loss**: Calories = TDEE × 0.8 (20% deficit, minimum 1200 calories)
- **Maintenance**: Calories = TDEE

### Macronutrient Distribution

- **Protein**: LBM × protein factor (varies by goal and preference)
- **Fat**: Maximum of (weight in kg × 0.8) or (25% of total calories ÷ 9)
- **Carbs**: Remaining calories ÷ 4

Each macro provides different caloric values:

- Protein: 4 calories per gram
- Carbohydrates: 4 calories per gram
- Fat: 9 calories per gram

## Deployment

The application can be easily deployed on [Vercel](https://vercel.com/), the platform from the creators of Next.js.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
