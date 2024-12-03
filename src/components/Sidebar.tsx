import { useEffect, useState } from 'react';
import { Category, getAllCategories } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { isAdmin, addCategory, deleteCategory } = useAuth();

  // Load and update categories
  useEffect(() => {
    const loadCategories = () => {
      setCategories(getAllCategories());
    };

    loadCategories();

    // Listen for storage changes
    window.addEventListener('storage', loadCategories);
    window.addEventListener('categoriesUpdated', loadCategories);
    return () => {
      window.removeEventListener('storage', loadCategories);
      window.removeEventListener('categoriesUpdated', loadCategories);
    };
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCategory.trim();
    
    if (trimmedName) {
      // Check if category already exists (case-insensitive)
      if (categories.some(cat => 
        cat.name.toLowerCase() === trimmedName.toLowerCase()
      )) {
        alert('This category already exists');
        return;
      }

      // Add category through AuthContext
      addCategory(trimmedName);
      
      // Reset form
      setNewCategory('');
      setIsAdding(false);

      // Trigger update
      window.dispatchEvent(new Event('categoriesUpdated'));
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    // Only allow deletion of custom categories (those with id > 5)
    if (Number(categoryId) <= 5) {
      alert('Default categories cannot be deleted');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      deleteCategory(categoryId);

      // If the deleted category was selected, clear the selection
      if (selectedCategory === categoryName) {
        onSelectCategory(null);
      }

      // Trigger update
      window.dispatchEvent(new Event('categoriesUpdated'));
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(selectedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="w-64 hidden md:block">
      <div className="sticky top-20">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Categories</h2>
              {isAdmin && !isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                  title="Add category"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {isAdmin && isAdding && (
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={handleAddCategory} className="space-y-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setNewCategory('');
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newCategory.trim()}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}

          <nav className="p-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between group"
              >
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex-1 flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${
                    selectedCategory === category.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs ${
                    selectedCategory === category.name ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {category.count}
                  </span>
                </button>
                
                {isAdmin && Number(category.id) > 5 && (
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="p-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}