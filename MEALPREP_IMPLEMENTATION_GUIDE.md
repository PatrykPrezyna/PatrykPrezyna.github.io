# Mealprep Module - Implementation Guide

## Project Summary

This guide provides a complete roadmap for implementing a Mealprep module on your personal website. The module will help you manage favorite recipes and use a "Wheel of Fortune" feature to decide what to cook next, with smart selection that prioritizes recipes you haven't cooked recently.

## Quick Overview

**What it does:**
- Store and manage your favorite recipes
- Spin a wheel to randomly select what to cook (with smart weighting)
- Track when and how often you cook each recipe
- View statistics about your cooking habits
- Export/import recipes in JSON format

**Technology Stack:**
- HTML5 + CSS3 (matching your existing design system)
- Vue.js 3 (consistent with pomodoro.html)
- LocalStorage for data persistence
- Canvas API for wheel animation

## File Structure

```
c:/sources/PatrykPrezyna.github.io/
├── index.html                    # Add navigation link here
├── mealprep.html                 # New main page
├── js/
│   └── mealprep-app.js          # New Vue.js application
├── assets/
│   └── sounds/                   # Optional: wheel spin sounds
└── docs/
    ├── MEALPREP_FEATURE_PLAN.md
    ├── MEALPREP_ARCHITECTURE.md
    └── MEALPREP_IMPLEMENTATION_GUIDE.md (this file)
```

## Implementation Phases

### Phase 1: Foundation (Core Structure)
**Estimated Time: 2-3 hours**

**Tasks:**
1. Create [`mealprep.html`](mealprep.html) with basic layout
   - Copy structure from [`pomodoro.html`](pomodoro.html)
   - Adapt navigation and theme system
   - Set up main container sections

2. Create [`js/mealprep-app.js`](js/mealprep-app.js)
   - Initialize Vue.js application
   - Set up reactive data structure
   - Implement localStorage utilities

3. Add navigation link in [`index.html`](index.html:812)
   - Add "Mealprep" link to nav menu
   - Position between "Pomodoro" and "Contact"

**Deliverables:**
- Working page with navigation
- Theme toggle functionality
- Basic Vue.js app structure

### Phase 2: Recipe Management (CRUD Operations)
**Estimated Time: 4-5 hours**

**Tasks:**
1. Build recipe form component
   - Input fields for all recipe properties
   - Ingredient list with add/remove
   - Tag input with autocomplete
   - Form validation

2. Implement recipe list display
   - Grid layout for recipe cards
   - Recipe card design with all info
   - Action buttons (view, edit, delete)

3. Create recipe detail modal
   - Full recipe view
   - Cooking history display
   - Edit and delete actions

4. Add CRUD operations
   - Create new recipe
   - Read/view recipe details
   - Update existing recipe
   - Delete with confirmation

**Deliverables:**
- Fully functional recipe management
- Recipe cards with visual appeal
- Modal for detailed view

### Phase 3: Wheel of Fortune (Core Feature)
**Estimated Time: 5-6 hours**

**Tasks:**
1. Design wheel UI
   - Canvas-based circular wheel
   - Recipe segments with names
   - Center spin button
   - Visual styling

2. Implement spinning animation
   - Smooth rotation with easing
   - Deceleration effect
   - Pointer/indicator
   - Sound effects (optional)

3. Build smart selection algorithm
   - Weight calculation based on:
     - Days since last cooked
     - Total times cooked
     - Never cooked priority
   - Weighted random selection
   - Result display

4. Add cooking confirmation
   - "I cooked this" button
   - Date/time logging
   - History update
   - Success feedback

**Deliverables:**
- Animated wheel of fortune
- Smart recipe selection
- Cooking confirmation system

### Phase 4: Statistics & History
**Estimated Time: 3-4 hours**

**Tasks:**
1. Build statistics dashboard
   - Total recipes count
   - Total times cooked
   - Most/least cooked recipes
   - Never cooked list
   - Average days between cooking

2. Create cooking history log
   - Chronological list of cooking events
   - Filter by recipe
   - Date range filtering
   - Visual timeline (optional)

3. Add data visualization
   - Simple charts/graphs
   - Cooking frequency over time
   - Recipe popularity

**Deliverables:**
- Statistics dashboard
- Cooking history view
- Visual insights

### Phase 5: Data Management & Polish
**Estimated Time: 2-3 hours**

**Tasks:**
1. Implement export/import
   - Export all data as JSON
   - Import JSON file
   - Data validation on import
   - Merge or replace options

2. Add search and filtering
   - Search by name/ingredients
   - Filter by tags/difficulty
   - Sort options (name, time, frequency)
   - Debounced search input

3. Responsive design
   - Mobile-friendly layouts
   - Touch-optimized wheel
   - Adaptive grid
   - Mobile navigation

4. Testing and bug fixes
   - Test all features
   - Edge case handling
   - Error messages
   - Performance optimization

**Deliverables:**
- Export/import functionality
- Search and filter system
- Mobile-responsive design
- Polished, tested application

## Data Structure Reference

### Recipe Object
```javascript
{
  id: "uuid-v4-string",
  name: "Spaghetti Carbonara",
  ingredients: [
    "400g spaghetti",
    "200g pancetta",
    "4 eggs",
    "100g parmesan cheese",
    "Black pepper",
    "Salt"
  ],
  instructions: "1. Boil pasta...\n2. Cook pancetta...\n3. Mix eggs...",
  prepTime: 10,        // minutes
  cookTime: 20,        // minutes
  servings: 4,
  difficulty: "medium", // easy, medium, hard
  tags: ["italian", "pasta", "dinner"],
  imageUrl: "https://example.com/image.jpg", // optional
  createdAt: "2026-05-28T19:00:00.000Z",
  updatedAt: "2026-05-28T19:00:00.000Z"
}
```

### Cooking History Entry
```javascript
{
  id: "uuid-v4-string",
  recipeId: "recipe-uuid",
  cookedAt: "2026-05-28T19:00:00.000Z",
  confirmed: true
}
```

### LocalStorage Keys
- `mealprep_recipes` - Array of recipe objects
- `mealprep_history` - Array of cooking history entries
- `mealprep_settings` - User preferences object

## Key Algorithms

### Smart Recipe Selection
```javascript
function calculateRecipeWeight(recipe, history) {
  const cookingEvents = history.filter(h => h.recipeId === recipe.id);
  
  // Never cooked = highest priority
  if (cookingEvents.length === 0) {
    return 100;
  }
  
  // Calculate days since last cooked
  const lastCooked = new Date(cookingEvents[cookingEvents.length - 1].cookedAt);
  const daysSinceLastCooked = (Date.now() - lastCooked) / (1000 * 60 * 60 * 24);
  
  // Weight based on frequency (less cooked = higher weight)
  const frequencyWeight = Math.max(1, 50 - (cookingEvents.length * 5));
  
  // Weight based on recency (longer ago = higher weight)
  const recencyWeight = Math.min(50, daysSinceLastCooked * 2);
  
  return frequencyWeight + recencyWeight;
}

function selectRecipe(recipes, history) {
  // Calculate weights for all recipes
  const weights = recipes.map(r => calculateRecipeWeight(r, history));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  // Weighted random selection
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < recipes.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return recipes[i];
    }
  }
  
  return recipes[recipes.length - 1];
}
```

## Design Guidelines

### Color Scheme (from existing theme)
```css
/* Light Theme */
--bg: #F6F4EF;
--bg-card: #FFFFFF;
--fg: #1C1C27;
--fg-muted: #66687A;
--accent: #2A5C8A;
--accent-lt: #E8F0F8;
--border: #E3E0D8;

/* Dark Theme */
--bg: #0F141C;
--bg-card: #161D28;
--fg: #EDF2FA;
--fg-muted: #A9B6C8;
--accent: #7BA6D9;
--accent-lt: #1D2C40;
--border: #2B3646;

/* Difficulty Colors */
--easy: #4C9F70;
--medium: #D9A84C;
--hard: #D95550;
```

### Typography
```css
--serif: 'Cormorant Garamond', Georgia, serif;
--sans: 'Plus Jakarta Sans', system-ui, sans-serif;
```

### Component Styling
- Border radius: `12px`
- Card shadow: `0 4px 18px rgba(10,20,30,0.06)`
- Hover shadow: `0 10px 34px rgba(10,20,30,0.12)`
- Transition: `0.2s ease`

## Testing Checklist

### Functionality Tests
- [ ] Add new recipe with all fields
- [ ] Edit existing recipe
- [ ] Delete recipe with confirmation
- [ ] View recipe details
- [ ] Search recipes by name
- [ ] Filter by tags
- [ ] Sort by different criteria
- [ ] Spin wheel and get selection
- [ ] Confirm cooking and update history
- [ ] View statistics
- [ ] Export data to JSON
- [ ] Import data from JSON
- [ ] Theme toggle works
- [ ] Navigation works

### Edge Cases
- [ ] Empty recipe list
- [ ] Recipe with no cooking history
- [ ] Recipe cooked many times
- [ ] Recipe cooked today
- [ ] Invalid JSON import
- [ ] Duplicate recipe names
- [ ] Very long recipe names/instructions
- [ ] Missing optional fields
- [ ] LocalStorage full

### Responsive Design
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Touch interactions on mobile
- [ ] Wheel animation on mobile
- [ ] Modal behavior on small screens

### Performance
- [ ] Page loads quickly
- [ ] Smooth wheel animation
- [ ] Search is responsive
- [ ] No lag with many recipes
- [ ] Images load efficiently

## Future Enhancements

### Phase 6+ (Optional)
1. **Meal Planning Calendar**
   - Weekly meal planner
   - Drag-and-drop recipes to days
   - Shopping list generation

2. **Recipe Collections**
   - Group recipes into collections
   - Quick meals, weekend cooking, etc.
   - Collection-based wheel spin

3. **Advanced Statistics**
   - Charts and graphs
   - Cooking trends over time
   - Seasonal preferences

4. **Social Features**
   - Share recipes via URL
   - Export single recipe
   - Recipe ratings

5. **Enhanced Media**
   - Upload recipe images
   - Multiple images per recipe
   - Video instructions

## Resources

### Documentation
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [LocalStorage Guide](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Related Files
- [`MEALPREP_FEATURE_PLAN.md`](MEALPREP_FEATURE_PLAN.md) - Detailed feature specifications
- [`MEALPREP_ARCHITECTURE.md`](MEALPREP_ARCHITECTURE.md) - System architecture and diagrams
- [`pomodoro.html`](pomodoro.html) - Reference implementation
- [`js/pomodoro-app.js`](js/pomodoro-app.js) - Vue.js reference code

## Getting Started

1. **Review the plan** - Read through all documentation
2. **Set up structure** - Create basic HTML and JS files
3. **Implement incrementally** - Follow phases in order
4. **Test frequently** - Test each feature as you build
5. **Iterate and improve** - Refine based on usage

## Support

For questions or issues during implementation:
- Review the architecture diagrams
- Check the pomodoro implementation for patterns
- Test in browser console for debugging
- Use Vue DevTools for state inspection

---

**Total Estimated Time: 16-21 hours**

**Recommended Approach:**
- Work in phases
- Complete one phase before moving to next
- Test thoroughly at each phase
- Commit code after each major feature

Good luck with your implementation! 🍳

## Appendix: Sample Data Structure

### Sample Recipe Data (for testing)
```json
{
  "recipes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Spaghetti Carbonara",
      "ingredients": [
        "400g spaghetti",
        "200g pancetta or guanciale",
        "4 large eggs",
        "100g Pecorino Romano cheese",
        "Black pepper",
        "Salt"
      ],
      "instructions": "1. Bring a large pot of salted water to boil and cook spaghetti according to package directions.\n2. While pasta cooks, cut pancetta into small cubes and fry in a large pan until crispy.\n3. In a bowl, whisk together eggs and grated cheese.\n4. When pasta is done, reserve 1 cup pasta water, then drain.\n5. Add hot pasta to the pan with pancetta (off heat).\n6. Quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce.\n7. Season generously with black pepper and serve immediately.",
      "prepTime": 10,
      "cookTime": 20,
      "servings": 4,
      "difficulty": "medium",
      "tags": ["italian", "pasta", "dinner", "quick"],
      "imageUrl": "",
      "createdAt": "2026-05-01T10:00:00.000Z",
      "updatedAt": "2026-05-01T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Chicken Stir Fry",
      "ingredients": [
        "500g chicken breast, sliced",
        "2 bell peppers, sliced",
        "1 onion, sliced",
        "3 cloves garlic, minced",
        "2 tbsp soy sauce",
        "1 tbsp oyster sauce",
        "1 tsp sesame oil",
        "2 tbsp vegetable oil",
        "Salt and pepper"
      ],
      "instructions": "1. Heat vegetable oil in a wok or large pan over high heat.\n2. Add chicken and stir-fry until cooked through, about 5-7 minutes.\n3. Remove chicken and set aside.\n4. Add more oil if needed, then stir-fry garlic, onion, and peppers for 3-4 minutes.\n5. Return chicken to pan.\n6. Add soy sauce, oyster sauce, and sesame oil.\n7. Stir-fry for 2 more minutes until everything is well combined.\n8. Serve hot over rice.",
      "prepTime": 15,
      "cookTime": 15,
      "servings": 4,
      "difficulty": "easy",
      "tags": ["asian", "chicken", "dinner", "quick", "healthy"],
      "imageUrl": "",
      "createdAt": "2026-05-05T14:30:00.000Z",
      "updatedAt": "2026-05-05T14:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Beef Bourguignon",
      "ingredients": [
        "1kg beef chuck, cubed",
        "200g bacon, diced",
        "2 carrots, sliced",
        "1 onion, chopped",
        "3 cloves garlic, minced",
        "750ml red wine",
        "2 cups beef stock",
        "2 tbsp tomato paste",
        "2 bay leaves",
        "Fresh thyme",
        "250g mushrooms",
        "Flour for dusting",
        "Salt and pepper"
      ],
      "instructions": "1. Season beef with salt and pepper, dust with flour.\n2. Brown beef in batches in a large pot, set aside.\n3. Cook bacon until crispy, remove and set aside.\n4. Sauté onions, carrots, and garlic in the same pot.\n5. Add tomato paste and cook for 1 minute.\n6. Return beef and bacon to pot.\n7. Add wine, stock, bay leaves, and thyme.\n8. Bring to boil, then reduce heat and simmer covered for 2.5 hours.\n9. Add mushrooms and cook for 30 more minutes.\n10. Adjust seasoning and serve with mashed potatoes or crusty bread.",
      "prepTime": 30,
      "cookTime": 180,
      "servings": 6,
      "difficulty": "hard",
      "tags": ["french", "beef", "dinner", "comfort-food", "weekend"],
      "imageUrl": "",
      "createdAt": "2026-05-10T16:00:00.000Z",
      "updatedAt": "2026-05-10T16:00:00.000Z"
    }
  ],
  "history": [
    {
      "id": "hist-001",
      "recipeId": "550e8400-e29b-41d4-a716-446655440001",
      "cookedAt": "2026-05-15T18:30:00.000Z",
      "confirmed": true
    },
    {
      "id": "hist-002",
      "recipeId": "550e8400-e29b-41d4-a716-446655440002",
      "cookedAt": "2026-05-18T19:00:00.000Z",
      "confirmed": true
    },
    {
      "id": "hist-003",
      "recipeId": "550e8400-e29b-41d4-a716-446655440001",
      "cookedAt": "2026-05-22T18:45:00.000Z",
      "confirmed": true
    },
    {
      "id": "hist-004",
      "recipeId": "550e8400-e29b-41d4-a716-446655440002",
      "cookedAt": "2026-05-25T19:15:00.000Z",
      "confirmed": true
    }
  ],
  "settings": {
    "theme": "light",
    "soundEnabled": true,
    "defaultView": "grid",
    "sortPreference": "name"
  }
}
```

### Notes on Sample Data
- Recipe 1 (Carbonara): Cooked twice - medium frequency
- Recipe 2 (Stir Fry): Cooked twice - medium frequency  
- Recipe 3 (Beef Bourguignon): Never cooked - highest priority for wheel
- This demonstrates the smart selection algorithm prioritizing the never-cooked recipe