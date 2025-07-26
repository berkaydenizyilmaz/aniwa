import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/schemas/auth.schema';
import { resetPasswordBusiness } from '@/lib/services/business/auth.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = resetPasswordSchema.parse(body);
    
    // Business logic
    const result = await resetPasswordBusiness(validatedData.token, validatedData.password);
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 