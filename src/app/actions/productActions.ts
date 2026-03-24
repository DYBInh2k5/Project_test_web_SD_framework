'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        categoryId: data.categoryId,
      }
    });
    revalidatePath('/dashboard/products');
    return { success: true, product };
  } catch (error) {
    console.error('Add product error:', error);
    return { success: false, error: 'Failed to add product' };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        categoryId: data.categoryId,
      }
    });
    revalidatePath('/dashboard/products');
    return { success: true, product };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function addCategory(name: string, description: string) {
  try {
    const cat = await prisma.category.create({
      data: { name, description }
    });
    revalidatePath('/dashboard/products');
    return { success: true, category: cat };
  } catch (error) {
    return { success: false, error: 'Failed to add category' };
  }
}
