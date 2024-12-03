import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Welcome to ForumFlow!
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              This template is provided by <span className="font-medium">Xinghan Pan</span>. 
              Here's how you can customize it:
            </p>
            
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Update categories in the Sidebar component</li>
              <li>Modify the color scheme in tailwind classes</li>
              <li>Add new features using the existing component structure</li>
              <li>Customize the header and branding</li>
            </ul>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}