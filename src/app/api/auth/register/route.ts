import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/schemas/auth.schema';
import { registerUserBusiness } from '@/lib/services/business/auth.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = registerSchema.parse(body);
    
    // Business logic
    const result = await registerUserBusiness(validatedData);
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 