import { supabase } from '../lib/supabase';

/**
 * Upload a customer photo to Supabase Storage
 * @param file - The image file to upload
 * @param customerId - The customer ID (or temporary ID for new customers)
 * @param type - Type of photo: 'referencia' or 'folio'
 * @returns Public URL of the uploaded image
 */
export async function uploadCustomerPhoto(
    file: File,
    customerId: string,
    type: 'referencia' | 'folio'
): Promise<string> {
    if (!supabase) {
        throw new Error('Supabase no está configurado');
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${customerId}_${type}_${Date.now()}.${fileExt}`;
    const filePath = `customer-photos/${fileName}`;

    // Upload file to Supabase Storage
    const { error } = await supabase.storage
        .from('customer-photos')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error(`Error subiendo imagen: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
        .from('customer-photos')
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}

/**
 * Delete a customer photo from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export async function deleteCustomerPhoto(url: string): Promise<void> {
    if (!supabase) {
        throw new Error('Supabase no está configurado');
    }

    try {
        // Extract file path from URL
        const urlParts = url.split('/customer-photos/');
        if (urlParts.length < 2) {
            throw new Error('URL inválida');
        }

        const filePath = `customer-photos/${urlParts[1]}`;

        const { error } = await supabase.storage
            .from('customer-photos')
            .remove([filePath]);

        if (error) {
            throw new Error(`Error eliminando imagen: ${error.message}`);
        }
    } catch (error) {
        console.error('Error deleting photo:', error);
        // Don't throw error for deletion failures
    }
}
