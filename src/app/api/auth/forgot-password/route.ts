import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/schemas/auth.schema';
import { forgotPasswordBusiness } from '@/lib/services/business/auth.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = forgotPasswordSchema.parse(body);
    
    // Business logic
    const result = await forgotPasswordBusiness(validatedData.email);
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 