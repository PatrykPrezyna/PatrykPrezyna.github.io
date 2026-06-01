# Mealprep Module - Usage Guide

## 🎉 Implementation Complete!

The Mealprep module has been successfully implemented with all planned features. This guide will help you test and use the application.

## 📁 Files Created

1. **mealprep.html** (1,291 lines)
   - Complete HTML structure with Vue.js integration
   - Responsive design with light/dark theme support
   - All UI components and modals

2. **js/mealprep-app.js** (761 lines)
   - Vue.js 3 application
   - Smart recipe selection algorithm
   - Wheel of Fortune animation
   - Complete CRUD operations
   - Export/Import functionality
   - LocalStorage persistence

3. **index.html** (modified)
   - Added "Mealprep" navigation link

## 🚀 How to Access

1. Open your website in a browser
2. Click on the "Mealprep" link in the navigation menu
3. Or directly navigate to: `https://your-domain.com/mealprep.html`

## ✨ Features Overview

### 1. Dashboard Statistics
- **Total Recipes**: Count of recipes in your collection
- **Times Cooked**: Total cooking sessions logged
- **Most Popular**: Recipe you've cooked the most
- **Never Cooked**: Recipes waiting to be tried

### 2. Wheel of Fortune 🎡
- **Smart Selection**: Prioritizes recipes you haven't cooked recently
- **Animated Wheel**: Smooth spinning animation with deceleration
- **Cooking Confirmation**: Log when you cook the selected recipe
- **View Recipe**: Quick access to full recipe details

### 3. Recipe Management
- **Add Recipe**: Complete form with all details
- **Edit Recipe**: Modify existing recipes
- **Delete Recipe**: Remove recipes with confirmation
- **View Details**: Full recipe information in modal

### 4. Search & Filter
- **Search**: Find recipes by name, ingredients, or tags
- **Difficulty Filter**: Filter by Easy, Medium, or Hard
- **Sort Options**: 
  - By Name
  - By Difficulty
  - By Prep Time
  - By Cook Time
  - By Last Cooked

### 5. Recipe Cards
Each recipe card displays:
- Recipe name
- Difficulty badge (color-coded)
- Total time (prep + cook)
- Number of servings
- Tags
- Times cooked
- Last cooked date

### 6. Data Management
- **Export Data**: Download all recipes and history as JSON
- **Import Data**: Upload JSON backup file
- **Merge or Replace**: Choose to merge with existing data or replace
- **Auto-save**: All changes automatically saved to browser storage

## 📝 How to Use

### Adding Your First Recipe

1. Click the **"+ Add Recipe"** button
2. Fill in the recipe details:
   - **Name**: Recipe title (required)
   - **Prep Time**: Minutes to prepare (required)
   - **Cook Time**: Minutes to cook (required)
   - **Servings**: Number of servings (required)
   - **Difficulty**: Easy, Medium, or Hard (required)
   - **Ingredients**: List of ingredients (required, add multiple)
   - **Instructions**: Step-by-step cooking instructions (required)
   - **Tags**: Comma-separated tags (optional, e.g., "italian, pasta, dinner")
   - **Image URL**: Link to recipe image (optional)
3. Click **"Add Recipe"**

### Using the Wheel of Fortune

1. Make sure you have at least one recipe added
2. Click **"🎲 Spin the Wheel"**
3. Watch the wheel spin and select a recipe
4. When it stops, you'll see the selected recipe
5. Click **"✓ I Cooked This!"** to log the cooking event
6. Or click **"View Recipe"** to see full details

### Editing a Recipe

1. Click on any recipe card to view details
2. Click the **"Edit"** button in the modal
3. Modify the recipe information
4. Click **"Update Recipe"**

### Deleting a Recipe

1. Click on a recipe card to view details
2. Click the **"Delete"** button
3. Confirm the deletion

### Searching and Filtering

1. Use the search box to find recipes by name, ingredients, or tags
2. Click difficulty filter buttons (All, Easy, Medium, Hard)
3. Use the sort dropdown to organize recipes
4. Filters and search work together

### Exporting Your Data

1. Click **"📥 Export Data"** button
2. A JSON file will be downloaded with format: `mealprep-backup-YYYY-MM-DD.json`
3. Save this file as a backup

### Importing Data

1. Click **"📤 Import Data"** button
2. Select a JSON backup file
3. Choose to:
   - **Merge**: Keep existing recipes and add new ones
   - **Replace**: Delete existing and load imported data
4. Data will be imported and saved

## 🎨 Theme Support

- Click the theme toggle button (🌙/☀️) in the navigation
- Switches between light and dark mode
- Theme preference is saved automatically

## 🧮 Smart Selection Algorithm

The wheel uses a weighted random selection algorithm:

### Weight Calculation
- **Never Cooked**: Weight = 100 (highest priority)
- **Frequency Weight**: 50 - (times cooked × 5), minimum 1
- **Recency Weight**: days since last cooked × 2, maximum 50
- **Total Weight**: Frequency + Recency

### Example
- Recipe A: Never cooked → Weight = 100
- Recipe B: Cooked 2 times, 10 days ago → Weight = (50 - 10) + 20 = 60
- Recipe C: Cooked 5 times, 3 days ago → Weight = (50 - 25) + 6 = 31

Recipe A has the highest chance of being selected!

## 📊 Data Structure

### Recipe Object
```json
{
  "id": "uuid-string",
  "name": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": "Step-by-step instructions",
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "difficulty": "medium",
  "tags": ["tag1", "tag2"],
  "imageUrl": "https://example.com/image.jpg",
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

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Page loads without errors
- [ ] Theme toggle works (light/dark)
- [ ] Navigation back to home works
- [ ] Dashboard shows correct statistics

### Recipe Management
- [ ] Can add a new recipe with all fields
- [ ] Recipe appears in the grid
- [ ] Can click recipe card to view details
- [ ] Can edit recipe and changes are saved
- [ ] Can delete recipe with confirmation
- [ ] Recipe is removed from grid after deletion

### Search & Filter
- [ ] Search by recipe name works
- [ ] Search by ingredient works
- [ ] Search by tag works
- [ ] Difficulty filters work (Easy, Medium, Hard, All)
- [ ] Sort options work correctly
- [ ] Multiple filters work together

### Wheel of Fortune
- [ ] Wheel displays all recipes
- [ ] Spin button is disabled when no recipes
- [ ] Wheel spins smoothly
- [ ] Selected recipe is displayed
- [ ] "I Cooked This" button logs cooking event
- [ ] Statistics update after cooking confirmation
- [ ] "View Recipe" button opens detail modal

### Data Persistence
- [ ] Recipes persist after page reload
- [ ] Cooking history persists after page reload
- [ ] Theme preference persists after page reload
- [ ] Search/filter state resets on page reload (expected)

### Export/Import
- [ ] Export downloads JSON file
- [ ] Exported file contains all recipes and history
- [ ] Import accepts valid JSON file
- [ ] Merge option adds new recipes without duplicates
- [ ] Replace option replaces all data
- [ ] Invalid JSON shows error message

### Responsive Design
- [ ] Works on desktop (> 1024px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on mobile (< 768px)
- [ ] Wheel is touch-friendly on mobile
- [ ] Modals work on small screens
- [ ] Navigation is accessible on mobile

### Edge Cases
- [ ] Empty state shows when no recipes
- [ ] No results state shows when search has no matches
- [ ] Can't spin wheel with 0 recipes
- [ ] Can add recipe with minimal required fields
- [ ] Can add recipe with all optional fields
- [ ] Long recipe names are handled properly
- [ ] Many tags display correctly
- [ ] Recipe with no cooking history shows "Never cooked"

## 🐛 Troubleshooting

### Wheel Not Spinning
- Make sure you have at least one recipe added
- Check browser console for JavaScript errors
- Refresh the page

### Data Not Saving
- Check if browser allows localStorage
- Try in a different browser
- Export data as backup before troubleshooting

### Import Not Working
- Ensure JSON file is valid
- Check file was exported from Mealprep
- Try exporting current data first to see correct format

### Theme Not Changing
- Clear browser cache
- Check localStorage is enabled
- Try in incognito/private mode

## 💡 Tips & Best Practices

1. **Regular Backups**: Export your data regularly
2. **Descriptive Tags**: Use consistent tags for better filtering
3. **Accurate Times**: Enter realistic prep and cook times
4. **Clear Instructions**: Write step-by-step instructions
5. **Use the Wheel**: Let it help you try new recipes
6. **Track Cooking**: Always confirm when you cook to improve selection

## 🔮 Future Enhancements

Potential features for future versions:
- Meal planning calendar
- Shopping list generation
- Recipe collections/categories
- Recipe ratings
- Nutritional information
- Cost tracking
- Recipe sharing
- Print recipe feature
- Recipe images upload
- Cooking timer integration

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all files are in correct locations
3. Ensure Vue.js CDN is accessible
4. Try clearing browser cache
5. Test in different browser

## 🎊 Enjoy Your Mealprep Module!

Start adding your favorite recipes and let the Wheel of Fortune help you decide what to cook next. Happy cooking! 🍳👨‍🍳