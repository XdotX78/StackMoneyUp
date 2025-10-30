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
    Tabs,
} from '@/components/ui';

interface ComponentsDemoProps {
    params: Promise<{ lang: string }>;
}

export default function ComponentsDemoPage({ params }: ComponentsDemoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const tabsData = {
        tabs: [
            {
                id: 'buttons',
                label: 'Buttons',
                content: (
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-xl font-semibold">Button Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="primary" disabled>
                                    Disabled
                                </Button>
                                <Button variant="primary" isLoading>
                                    Loading
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-semibold">Button Sizes</h3>
                            <div className="flex items-center gap-4">
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: 'inputs',
                label: 'Forms',
                content: (
                    <div className="space-y-6 max-w-2xl">
                        <Input
                            label="Name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            helperText="We'll never share your email"
                        />
                        <Input
                            label="Error State"
                            placeholder="This has an error"
                            error="This field is required"
                        />
                        <Input
                            label="Disabled Input"
                            placeholder="Cannot type here"
                            disabled
                        />
                        <Textarea
                            label="Message"
                            placeholder="Enter your message here..."
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            showCharCount
                            maxLength={200}
                            helperText="Maximum 200 characters"
                        />
                    </div>
                ),
            },
            {
                id: 'badges',
                label: 'Badges',
                content: (
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-xl font-semibold">Badge Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Badge>Default</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="error">Error</Badge>
                                <Badge variant="info">Info</Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-semibold">Badge Sizes</h3>
                            <div className="flex items-center gap-4">
                                <Badge size="sm">Small</Badge>
                                <Badge size="md">Medium</Badge>
                                <Badge size="lg">Large</Badge>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: 'cards',
                label: 'Cards',
                content: (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <h3 className="text-xl font-semibold">Default Card</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    This is a default card with content. Cards are great for
                                    displaying content in a structured way.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button size="sm">Learn More</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="bordered">
                            <CardHeader>
                                <h3 className="text-xl font-semibold">Bordered Card</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    This card has an emerald border to draw attention.
                                </p>
                            </CardContent>
                        </Card>

                        <Card variant="elevated">
                            <CardHeader>
                                <h3 className="text-xl font-semibold">Elevated Card</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    This card has a shadow effect for depth.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ),
            },
            {
                id: 'modal',
                label: 'Modal',
                content: (
                    <div>
                        <h3 className="mb-4 text-xl font-semibold">Modal Demo</h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                            Click the button below to open a modal dialog.
                        </p>
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                            Open Modal
                        </Button>

                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        >
                            <ModalHeader>Example Modal</ModalHeader>
                            <ModalBody>
                                <p className="text-gray-600">
                                    This is a modal dialog. You can use it to display important
                                    information or confirm actions. Click outside or press Escape to
                                    close.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                ),
            },
        ]
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-2 text-4xl font-black">UI Components Demo</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
                A showcase of all the UI components built for StackMoneyUp
            </p>

            <Tabs {...tabsData} />
        </div>
    );
}

