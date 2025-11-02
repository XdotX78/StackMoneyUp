'use client';

import { useState } from 'react';
import { 
  Button, 
  Input,
  Textarea, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs
} from '@/components/ui';

export default function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            🎨 StackMoneyUp Component Library
          </h1>
          <p className="text-xl text-gray-600">
            All UI components ready to use!
          </p>
        </div>

        {/* Buttons Section */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold">Buttons</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inputs Section */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold">Inputs & Forms</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <Input 
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              />
              <Input 
                label="Password"
                type="password"
                placeholder="Enter password"
                helperText="Must be at least 8 characters"
              />
              <Input 
                label="Error Example"
                error="This field is required"
                placeholder="Test error state"
              />
              <Textarea
                label="Message"
                placeholder="Type your message here..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={4}
                showCharCount
                maxLength={200}
              />
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold">Badges</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold">Cards</h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Card variant="default">
                <CardContent>
                  <p className="font-semibold">Default Card</p>
                  <p className="text-sm text-gray-600 mt-2">Simple card with no border</p>
                </CardContent>
              </Card>
              <Card variant="bordered">
                <CardContent>
                  <p className="font-semibold">Bordered Card</p>
                  <p className="text-sm text-gray-600 mt-2">Card with border</p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardContent>
                  <p className="font-semibold">Elevated Card</p>
                  <p className="text-sm text-gray-600 mt-2">Card with shadow</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-4">
              <Card variant="bordered">
                <CardHeader>Card with Header</CardHeader>
                <CardContent>
                  This card has a header, content, and footer section.
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Modal Section */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold">Modal</h2>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalBody>
                <p className="text-gray-600">
                  This is a modal dialog. You can press ESC or click outside to close it.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </ModalFooter>
            </Modal>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold">Tabs</h2>
          </CardHeader>
          <CardContent>
            <Tabs
              tabs={[
                {
                  id: 'tab1',
                  label: 'English',
                  content: (
                    <div>
                      <h3 className="font-semibold mb-2">English Content</h3>
                      <p className="text-gray-600">This is the English tab content.</p>
                    </div>
                  )
                },
                {
                  id: 'tab2',
                  label: 'Italiano',
                  content: (
                    <div>
                      <h3 className="font-semibold mb-2">Contenuto Italiano</h3>
                      <p className="text-gray-600">Questo è il contenuto della scheda italiana.</p>
                    </div>
                  )
                },
                {
                  id: 'tab3',
                  label: 'Settings',
                  content: (
                    <div>
                      <h3 className="font-semibold mb-2">Settings</h3>
                      <p className="text-gray-600">Configure your preferences here.</p>
                    </div>
                  )
                }
              ]}
            />
          </CardContent>
        </Card>

        {/* Success Message */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">✅ Phase 2 Complete! All UI Components Ready</span>
          </div>
        </div>

      </div>
    </div>
  );
}
