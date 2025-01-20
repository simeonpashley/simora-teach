'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { organizationApiClient } from '@/app-api-clients/organization';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBusyModalOpen, setIsBusyModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateData = async () => {
    setIsConfirmOpen(false);
    setIsBusyModalOpen(true);

    try {
      const response = await organizationApiClient.createTestData();

      toast({
        title: 'Success',
        description: response.data?.message || 'Test data has been created successfully.',
      });
    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create test data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBusyModalOpen(false);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="mt-6">
          <div className="space-y-4">
            <Button
              variant="destructive"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isBusyModalOpen}
            >
              Create Data
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your organization data with test data
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCreateData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Busy Modal */}
      <AlertDialog open={isBusyModalOpen} onOpenChange={() => {}}>
        <AlertDialogContent className="max-w-[360px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Loader2 className="size-8 animate-spin text-primary" />
            <AlertDialogTitle>Creating Test Data</AlertDialogTitle>
            <AlertDialogDescription>
              Please wait while we create your test data...
            </AlertDialogDescription>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
