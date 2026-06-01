# Mealprep Module - Implementation Plan

## Overview
A comprehensive meal planning and recipe management system with a "Wheel of Fortune" feature to help decide what to cook next. The system tracks cooking frequency and dates, prioritizing recipes that haven't been cooked recently.

## Architecture

### File Structure
```
mealprep.html           # Main page with UI
js/
  mealprep-app.js       # Vue.js application logic
assets/
  sounds/               # Optional sound effects for wheel
```

## Data Structure

### Recipe Object
```json
{
  "id": "uuid-string",
  "name": "Recipe Name",
  "ingredients": [
    "ingredient 1",
    "ingredient 2"
  ],
  "instructions": "Step-by-step cooking instructions",
  "prepTime": 15,           // minutes
  "cookTime": 30,           // minutes
  "servings": 4,
  "difficulty": "easy",     // easy, medium, hard
  "tags": ["dinner", "vegetarian", "quick"],
  "imageUrl": "optional-url-to-image",
  "createdAt": "2026-05-28T19:00:00.000Z",
  "updatedAt": "2026-05-28T19:00:00.000Z"
}
```

### Cooking History Entry
```json
{
  "id": "uuid-string",
  "recipeId": "recipe-uuid",
  "cookedAt": "2026-05-28T19:00:00.000Z",
  "confirmed": true
}
```

### LocalStorage Keys
- `mealprep_recipes` - Array of recipe objects
- `mealprep_history` - Array of cooking history entries
- `mealprep_settings` - User preferences

## Features

### 1. Recipe Management
- **Add Recipe**: Form with all recipe fields
- **Edit Recipe**: Modify existing recipes
- **Delete Recipe**: Remove recipes with confirmation
- **View Recipe**: Detailed view with all information
- **Search**: Filter recipes by name, ingredients, or tags
- **Sort**: By name, difficulty, prep time, cook time, last cooked

### 2. Wheel of Fortune
- **Visual Wheel**: Animated spinning wheel with recipe names
- **Smart Selection Algorithm**:
  - Calculate "weight" for each recipe based on:
    - Days since last cooked (higher weight = longer time)
    - Total times cooked (higher weight = cooked less)
    - Never cooked recipes get highest priority
  - Use weighted random selection
- **Animation**: Smooth spinning animation with deceleration
- **Result Display**: Show selected recipe with details
- **Confirm Cooking**: Button to log that you cooked the recipe

### 3. Cooking History & Statistics
- **History Log**: List of all cooking events with dates
- **Statistics Dashboard**:
  - Total recipes in collection
  - Total times cooked
  - Most cooked recipe
  - Least cooked recipe
  - Recipes never cooked
  - Average days between cooking same recipe
  - Cooking frequency chart (optional)

### 4. Data Management
- **Export**: Download all recipes and history as JSON
- **Import**: Upload JSON file to restore/add recipes
- **Backup**: Automatic localStorage backup
- **Clear Data**: Reset all data with confirmation

## UI Components

### Main Layout
```
┌─────────────────────────────────────────┐
│ Navigation Bar (with theme toggle)      │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────┐  ┌───────────────┐  │
│  │  Wheel of     │  │  Recipe       │  │
│  │  Fortune      │  │  Statistics   │  │
│  └───────────────┘  └───────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Recipe List/Grid               │   │
│  │  [Search] [Filter] [Sort]       │   │
│  │  ┌────┐ ┌────┐ ┌────┐          │   │
│  │  │ R1 │ │ R2 │ │ R3 │          │   │
│  │  └────┘ └────┘ └────┘          │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Recipe Card
- Recipe name
- Difficulty badge
- Prep + Cook time
- Tags
- Last cooked date
- Times cooked counter
- Quick action buttons (view, edit, delete)

### Wheel of Fortune Component
- Circular wheel divided into segments
- Each segment shows recipe name
- Spin button in center
- Result display area
- Confirm cooking button

## Smart Selection Algorithm

### Weight Calculation
```javascript
function calculateRecipeWeight(recipe, history) {
  const cookingEvents = history.filter(h => h.recipeId === recipe.id);
  
  if (cookingEvents.length === 0) {
    return 100; // Never cooked - highest priority
  }
  
  const lastCooked = new Date(cookingEvents[cookingEvents.length - 1].cookedAt);
  const daysSinceLastCooked = (Date.now() - lastCooked) / (1000 * 60 * 60 * 24);
  const timesCookedWeight = Math.max(1, 50 - (cookingEvents.length * 5));
  const recencyWeight = Math.min(50, daysSinceLastCooked * 2);
  
  return timesCookedWeight + recencyWeight;
}
```

### Weighted Random Selection
```javascript
function selectRecipe(recipes, history) {
  const weights = recipes.map(r => calculateRecipeWeight(r, history));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < recipes.length; i++) {
    random -= weights[i];
    if (random <= 0) return recipes[i];
  }
  
  return recipes[recipes.length - 1];
}
```

## Design System

### Colors (matching existing theme)
- Primary: `#2A5C8A` (accent blue)
- Success: `#4C9F70` (green for confirmed)
- Warning: `#D95550` (red for delete)
- Background: `#F6F4EF` (light) / `#0F141C` (dark)
- Cards: `#FFFFFF` (light) / `#161D28` (dark)

### Typography
- Font: 'Plus Jakarta Sans' (matching pomodoro)
- Headings: 'Cormorant Garamond' (serif)

### Difficulty Badges
- Easy: Green badge
- Medium: Orange badge
- Hard: Red badge

## Implementation Phases

### Phase 1: Core Structure
1. Create mealprep.html with basic layout
2. Set up Vue.js application structure
3. Implement localStorage utilities
4. Create basic navigation

### Phase 2: Recipe Management
1. Build recipe form (add/edit)
2. Implement recipe list/grid display
3. Add search and filter functionality
4. Create recipe detail modal

### Phase 3: Wheel of Fortune
1. Design and implement wheel UI
2. Create spinning animation
3. Implement smart selection algorithm
4. Add cooking confirmation

### Phase 4: History & Statistics
1. Build cooking history log
2. Create statistics dashboard
3. Add data visualization (optional)

### Phase 5: Polish & Testing
1. Implement export/import
2. Add responsive design
3. Test all features
4. Add to main navigation

## Technical Considerations

### Browser Compatibility
- Modern browsers with ES6+ support
- LocalStorage API required
- CSS Grid and Flexbox for layout

### Performance
- Lazy load recipe images
- Efficient filtering and sorting
- Debounced search input
- Optimized wheel animation

### Data Validation
- Required fields validation
- Numeric field validation (times, servings)
- Duplicate recipe name checking
- JSON import validation

### User Experience
- Smooth animations
- Loading states
- Error messages
- Success confirmations
- Keyboard shortcuts
- Mobile-friendly touch interactions

## Future Enhancements (Optional)
- Recipe categories/collections
- Meal planning calendar
- Shopping list generation
- Recipe sharing (export single recipe)
- Recipe images upload
- Nutritional information
- Cost tracking
- Favorite recipes
- Recipe ratings
- Print recipe feature