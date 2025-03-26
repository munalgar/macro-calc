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

## Deployment

The application can be easily deployed on [Vercel](https://vercel.com/), the platform from the creators of Next.js.

## License

This project is licensed under the MIT License.
