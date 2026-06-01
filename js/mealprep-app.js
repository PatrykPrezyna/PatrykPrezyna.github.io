/**
 * ═══════════════════════════════════════════════════════════════════════
 * MEALPREP APPLICATION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * A comprehensive meal planning and recipe management system with a 
 * "Wheel of Fortune" feature to help decide what to cook next.
 * 
 * @author Patryk Prężyna
 * @version 1.0.0
 */

const { createApp } = Vue;

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CONSTANTS & CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════
 */

const STORAGE_KEYS = {
  RECIPES: 'mealprep_recipes',
  HISTORY: 'mealprep_history',
  SETTINGS: 'mealprep_settings'
};

const DIFFICULTY_COLORS = {
  easy: '#4C9F70',
  medium: '#D9A84C',
  hard: '#D95550'
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * UTILITY FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Generate a unique ID
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Load data from localStorage
 */
function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    return false;
  }
}

/**
 * Format date to relative time
 */
function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SMART SELECTION ALGORITHM
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Calculate weight for a recipe based on cooking history
 * Higher weight = more likely to be selected
 */
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
  // Decreases by 5 for each time cooked, minimum 1
  const frequencyWeight = Math.max(1, 50 - (cookingEvents.length * 5));
  
  // Weight based on recency (longer ago = higher weight)
  // Increases by 2 per day, maximum 50
  const recencyWeight = Math.min(50, daysSinceLastCooked * 2);
  
  return frequencyWeight + recencyWeight;
}

/**
 * Select a recipe using weighted random selection
 */
function selectRecipeWeighted(recipes, history) {
  if (recipes.length === 0) return null;
  if (recipes.length === 1) return recipes[0];
  
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

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WHEEL OF FORTUNE ANIMATION
 * ═══════════════════════════════════════════════════════════════════════
 */

class WheelOfFortune {
  constructor(canvas, recipes) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.recipes = recipes;
    this.rotation = 0;
    this.isSpinning = false;
    this.targetRotation = 0;
    this.spinSpeed = 0;
    
    this.resize();
    this.draw();
  }
  
  resize() {
    const size = Math.min(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.canvas.width = size;
    this.canvas.height = size;
    this.centerX = size / 2;
    this.centerY = size / 2;
    this.radius = size / 2 - 10;
  }
  
  draw() {
    const ctx = this.ctx;
    const recipes = this.recipes;
    
    if (recipes.length === 0) {
      // Draw empty wheel
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = '#E3E0D8';
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#66687A';
      ctx.font = '20px "Plus Jakarta Sans"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add recipes to spin!', this.centerX, this.centerY);
      return;
    }
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const sliceAngle = (Math.PI * 2) / recipes.length;
    
    // Draw slices
    recipes.forEach((recipe, index) => {
      const startAngle = this.rotation + (index * sliceAngle);
      const endAngle = startAngle + sliceAngle;
      
      // Alternate colors
      const colors = ['#2A5C8A', '#4C9F70', '#D9A84C', '#D95550', '#7BA6D9'];
      ctx.fillStyle = colors[index % colors.length];
      
      ctx.beginPath();
      ctx.moveTo(this.centerX, this.centerY);
      ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(this.centerX, this.centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px "Plus Jakarta Sans"';
      
      // Truncate long names
      let name = recipe.name;
      if (name.length > 15) {
        name = name.substring(0, 12) + '...';
      }
      
      ctx.fillText(name, this.radius * 0.3, 0);
      ctx.restore();
    });
    
    // Draw center circle
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2A5C8A';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  spin(targetRecipe) {
    if (this.isSpinning || this.recipes.length === 0) return;
    
    this.isSpinning = true;
    
    // Find target recipe index
    const targetIndex = this.recipes.findIndex(r => r.id === targetRecipe.id);
    const sliceAngle = (Math.PI * 2) / this.recipes.length;
    
    // Calculate target rotation (multiple full spins + target position)
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const targetAngle = -(targetIndex * sliceAngle) - (sliceAngle / 2);
    this.targetRotation = this.rotation + (Math.PI * 2 * spins) + targetAngle - this.rotation % (Math.PI * 2);
    
    this.spinSpeed = 0.5;
    this.animate();
  }
  
  animate() {
    if (!this.isSpinning) return;
    
    const diff = this.targetRotation - this.rotation;
    
    if (Math.abs(diff) < 0.001) {
      this.rotation = this.targetRotation;
      this.isSpinning = false;
      this.draw();
      return;
    }
    
    // Easing function for smooth deceleration
    this.rotation += diff * 0.05;
    this.draw();
    
    requestAnimationFrame(() => this.animate());
  }
  
  updateRecipes(recipes) {
    this.recipes = recipes;
    this.draw();
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * VUE APPLICATION
 * ═══════════════════════════════════════════════════════════════════════
 */

createApp({
  data() {
    return {
      // Data
      recipes: [],
      history: [],
      settings: {},
      
      // UI State
      showRecipeModal: false,
      showDetailModal: false,
      editingRecipe: null,
      viewingRecipe: null,
      selectedRecipe: null,
      isSpinning: false,
      
      // Filters & Search
      searchQuery: '',
      difficultyFilter: 'all',
      sortBy: 'name',
      filteredRecipes: [],
      
      // Form
      recipeForm: this.getEmptyRecipeForm(),
      
      // Wheel
      wheel: null
    };
  },
  
  computed: {
    totalRecipes() {
      return this.recipes.length;
    },
    
    totalCooked() {
      return this.history.length;
    },
    
    mostCookedRecipe() {
      if (this.recipes.length === 0) return 'None';
      
      const counts = {};
      this.history.forEach(h => {
        counts[h.recipeId] = (counts[h.recipeId] || 0) + 1;
      });
      
      let maxCount = 0;
      let maxRecipeId = null;
      
      for (const [recipeId, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          maxRecipeId = recipeId;
        }
      }
      
      if (!maxRecipeId) return 'None';
      
      const recipe = this.recipes.find(r => r.id === maxRecipeId);
      return recipe ? recipe.name : 'None';
    },
    
    mostCookedCount() {
      if (this.recipes.length === 0) return 0;
      
      const counts = {};
      this.history.forEach(h => {
        counts[h.recipeId] = (counts[h.recipeId] || 0) + 1;
      });
      
      return Math.max(0, ...Object.values(counts));
    },
    
    neverCookedCount() {
      return this.recipes.filter(recipe => {
        return !this.history.some(h => h.recipeId === recipe.id);
      }).length;
    }
  },
  
  methods: {
    /**
     * ═══════════════════════════════════════════════════════════════
     * DATA MANAGEMENT
     * ═══════════════════════════════════════════════════════════════
     */
    
    loadData() {
      this.recipes = loadFromStorage(STORAGE_KEYS.RECIPES, []);
      this.history = loadFromStorage(STORAGE_KEYS.HISTORY, []);
      this.settings = loadFromStorage(STORAGE_KEYS.SETTINGS, {});
      this.filterRecipes();
    },
    
    saveRecipes() {
      saveToStorage(STORAGE_KEYS.RECIPES, this.recipes);
    },
    
    saveHistory() {
      saveToStorage(STORAGE_KEYS.HISTORY, this.history);
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * RECIPE MANAGEMENT
     * ═══════════════════════════════════════════════════════════════
     */
    
    getEmptyRecipeForm() {
      return {
        name: '',
        ingredients: [''],
        instructions: '',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'medium',
        tagsInput: '',
        imageUrl: ''
      };
    },
    
    openAddRecipeModal() {
      this.editingRecipe = null;
      this.recipeForm = this.getEmptyRecipeForm();
      this.showRecipeModal = true;
    },
    
    closeRecipeModal() {
      this.showRecipeModal = false;
      this.editingRecipe = null;
    },
    
    addIngredient() {
      this.recipeForm.ingredients.push('');
    },
    
    removeIngredient(index) {
      this.recipeForm.ingredients.splice(index, 1);
    },
    
    saveRecipe() {
      // Validate
      if (!this.recipeForm.name.trim()) {
        alert('Please enter a recipe name');
        return;
      }
      
      const validIngredients = this.recipeForm.ingredients.filter(i => i.trim());
      if (validIngredients.length === 0) {
        alert('Please add at least one ingredient');
        return;
      }
      
      if (!this.recipeForm.instructions.trim()) {
        alert('Please enter cooking instructions');
        return;
      }
      
      // Parse tags
      const tags = this.recipeForm.tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t);
      
      const recipe = {
        id: this.editingRecipe ? this.editingRecipe.id : generateId(),
        name: this.recipeForm.name.trim(),
        ingredients: validIngredients,
        instructions: this.recipeForm.instructions.trim(),
        prepTime: this.recipeForm.prepTime,
        cookTime: this.recipeForm.cookTime,
        servings: this.recipeForm.servings,
        difficulty: this.recipeForm.difficulty,
        tags: tags,
        imageUrl: this.recipeForm.imageUrl.trim(),
        createdAt: this.editingRecipe ? this.editingRecipe.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (this.editingRecipe) {
        // Update existing
        const index = this.recipes.findIndex(r => r.id === this.editingRecipe.id);
        this.recipes[index] = recipe;
      } else {
        // Add new
        this.recipes.push(recipe);
      }
      
      this.saveRecipes();
      this.filterRecipes();
      this.closeRecipeModal();
      
      // Update wheel
      if (this.wheel) {
        this.wheel.updateRecipes(this.recipes);
      }
    },
    
    editRecipe(recipe) {
      this.editingRecipe = recipe;
      this.recipeForm = {
        name: recipe.name,
        ingredients: [...recipe.ingredients],
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        tagsInput: recipe.tags.join(', '),
        imageUrl: recipe.imageUrl || ''
      };
      this.showRecipeModal = true;
      this.closeDetailModal();
    },
    
    deleteRecipe(recipeId) {
      if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
      }
      
      this.recipes = this.recipes.filter(r => r.id !== recipeId);
      this.history = this.history.filter(h => h.recipeId !== recipeId);
      
      this.saveRecipes();
      this.saveHistory();
      this.filterRecipes();
      this.closeDetailModal();
      
      // Update wheel
      if (this.wheel) {
        this.wheel.updateRecipes(this.recipes);
      }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * RECIPE DETAIL
     * ═══════════════════════════════════════════════════════════════
     */
    
    viewRecipeDetail(recipe) {
      this.viewingRecipe = recipe;
      this.showDetailModal = true;
    },
    
    closeDetailModal() {
      this.showDetailModal = false;
      this.viewingRecipe = null;
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * FILTERING & SORTING
     * ═══════════════════════════════════════════════════════════════
     */
    
    filterRecipes() {
      let filtered = [...this.recipes];
      
      // Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(recipe => {
          return recipe.name.toLowerCase().includes(query) ||
                 recipe.ingredients.some(i => i.toLowerCase().includes(query)) ||
                 recipe.tags.some(t => t.toLowerCase().includes(query));
        });
      }
      
      // Difficulty filter
      if (this.difficultyFilter !== 'all') {
        filtered = filtered.filter(r => r.difficulty === this.difficultyFilter);
      }
      
      // Sort
      this.sortRecipesList(filtered);
      
      this.filteredRecipes = filtered;
    },
    
    setDifficultyFilter(difficulty) {
      this.difficultyFilter = difficulty;
      this.filterRecipes();
    },
    
    sortRecipes() {
      this.filterRecipes();
    },
    
    sortRecipesList(recipes) {
      switch (this.sortBy) {
        case 'name':
          recipes.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'difficulty':
          const diffOrder = { easy: 1, medium: 2, hard: 3 };
          recipes.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
          break;
        case 'prepTime':
          recipes.sort((a, b) => a.prepTime - b.prepTime);
          break;
        case 'cookTime':
          recipes.sort((a, b) => a.cookTime - b.cookTime);
          break;
        case 'lastCooked':
          recipes.sort((a, b) => {
            const aLast = this.getLastCookedDate(a.id);
            const bLast = this.getLastCookedDate(b.id);
            if (!aLast && !bLast) return 0;
            if (!aLast) return 1;
            if (!bLast) return -1;
            return new Date(bLast) - new Date(aLast);
          });
          break;
      }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * COOKING HISTORY
     * ═══════════════════════════════════════════════════════════════
     */
    
    getCookingCount(recipeId) {
      return this.history.filter(h => h.recipeId === recipeId).length;
    },
    
    getLastCookedDate(recipeId) {
      const events = this.history.filter(h => h.recipeId === recipeId);
      if (events.length === 0) return null;
      return events[events.length - 1].cookedAt;
    },
    
    getLastCookedText(recipeId) {
      const date = this.getLastCookedDate(recipeId);
      if (!date) return 'Never cooked';
      return 'Last: ' + formatRelativeTime(date);
    },
    
    addCookingEvent(recipeId) {
      const event = {
        id: generateId(),
        recipeId: recipeId,
        cookedAt: new Date().toISOString(),
        confirmed: true
      };
      
      this.history.push(event);
      this.saveHistory();
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * WHEEL OF FORTUNE
     * ═══════════════════════════════════════════════════════════════
     */
    
    spinWheel() {
      if (this.isSpinning || this.recipes.length === 0) return;
      
      this.isSpinning = true;
      this.selectedRecipe = null;
      
      // Select recipe using smart algorithm
      const selected = selectRecipeWeighted(this.recipes, this.history);
      
      // Spin the wheel
      if (this.wheel) {
        this.wheel.spin(selected);
      }
      
      // Show result after animation
      setTimeout(() => {
        this.selectedRecipe = selected;
        this.isSpinning = false;
      }, 4000);
    },
    
    confirmCooking() {
      if (!this.selectedRecipe) return;
      
      this.addCookingEvent(this.selectedRecipe.id);
      
      // Show success message
      alert(`Great! "${this.selectedRecipe.name}" has been added to your cooking history.`);
      
      // Reset selection
      this.selectedRecipe = null;
    },
    
    confirmCookingFromDetail() {
      if (!this.viewingRecipe) return;
      
      this.addCookingEvent(this.viewingRecipe.id);
      alert(`Great! "${this.viewingRecipe.name}" has been added to your cooking history.`);
      this.closeDetailModal();
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * EXPORT / IMPORT
     * ═══════════════════════════════════════════════════════════════
     */
    
    exportData() {
      const data = {
        recipes: this.recipes,
        history: this.history,
        settings: this.settings,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mealprep-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Data exported successfully!');
    },
    
    triggerImport() {
      this.$refs.fileInput.click();
    },
    
    importData(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate data structure
          if (!data.recipes || !Array.isArray(data.recipes)) {
            throw new Error('Invalid data format: recipes array missing');
          }
          
          // Ask user if they want to merge or replace
          const merge = confirm(
            'Do you want to MERGE the imported data with your existing recipes?\n\n' +
            'Click OK to merge (keep existing + add new)\n' +
            'Click Cancel to replace (delete existing)'
          );
          
          if (merge) {
            // Merge recipes (avoid duplicates by ID)
            const existingIds = new Set(this.recipes.map(r => r.id));
            const newRecipes = data.recipes.filter(r => !existingIds.has(r.id));
            this.recipes = [...this.recipes, ...newRecipes];
            
            // Merge history
            const existingHistoryIds = new Set(this.history.map(h => h.id));
            const newHistory = (data.history || []).filter(h => !existingHistoryIds.has(h.id));
            this.history = [...this.history, ...newHistory];
            
            alert(`Import successful!\nAdded ${newRecipes.length} new recipes and ${newHistory.length} history entries.`);
          } else {
            // Replace all data
            this.recipes = data.recipes;
            this.history = data.history || [];
            this.settings = data.settings || {};
            
            alert(`Import successful!\nLoaded ${this.recipes.length} recipes and ${this.history.length} history entries.`);
          }
          
          // Save to storage
          this.saveRecipes();
          this.saveHistory();
          saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
          
          // Update UI
          this.filterRecipes();
          if (this.wheel) {
            this.wheel.updateRecipes(this.recipes);
          }
          
        } catch (error) {
          console.error('Import error:', error);
          alert('Error importing data: ' + error.message + '\n\nPlease make sure the file is a valid Mealprep backup.');
        }
        
        // Reset file input
        event.target.value = '';
      };
      
      reader.readAsText(file);
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * INITIALIZATION
     * ═══════════════════════════════════════════════════════════════
     */
    
    initWheel() {
      const canvas = document.getElementById('wheelCanvas');
      if (canvas) {
        this.wheel = new WheelOfFortune(canvas, this.recipes);
        
        // Handle window resize
        window.addEventListener('resize', () => {
          if (this.wheel) {
            this.wheel.resize();
            this.wheel.draw();
          }
        });
      }
    }
  },
  
  mounted() {
    // Load data
    this.loadData();
    
    // Initialize wheel
    this.$nextTick(() => {
      this.initWheel();
    });
  }
}).mount('#app');

// Made with Bob
