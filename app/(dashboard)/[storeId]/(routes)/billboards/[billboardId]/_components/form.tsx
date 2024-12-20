'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertModal } from '@/modals/alert-modal';
import { billboardFormSchema } from '@/schemas/form-schema';

interface SettingFormProps {
  initialData: Billboard | null;
}

type SettingFormValues = z.infer<typeof billboardFormSchema>;

export function BillboardForm({ initialData }: SettingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { refresh } = useRouter();

  const title = initialData ? 'Editar Painel' : 'Criar Painel';
  const description = initialData
    ? 'Editar um Painel'
    : 'Adicionar novo Painel';
  const toastMessage = initialData ? 'Painel atualizado!' : 'Painel criado!';
  const action = initialData ? 'Salvar mudanças' : 'Criar';

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(billboardFormSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (values: SettingFormValues) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, {
        values,
      });
      refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error('Algo deu errado! Tente novamente!');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      refresh();
      toast.success('Painel deletado!');
    } catch (error) {
      console.log(error);

      toast.error('Primeiro remova todas as categorias e produtos.');
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={'destructive'}
            size={'icon'}
            disabled={isLoading}
            onClick={() => setIsOpen(true)}>
            <Trash className='size-4' />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiqueta</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Digite o nome'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={isLoading} className='ml-auto'>
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </>
  );
}