import { Category } from '../types';

const categories: Category[] = [
  { id: '1', name: 'General Discussion', count: 145 },
  { id: '2', name: 'Announcements', count: 23 },
  { id: '3', name: 'Questions & Help', count: 89 },
  { id: '4', name: 'Show & Tell', count: 56 },
  { id: '5', name: 'Off-Topic', count: 34 },
];

export default function Sidebar() {
  return (
    <div className="w-64 hidden md:block">
      <div className="sticky top-20">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Categories</h2>
          </div>
          <nav className="p-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href="#"
                className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              >
                <span className="text-gray-700">{category.name}</span>
                <span className="text-gray-500 text-xs">{category.count}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}