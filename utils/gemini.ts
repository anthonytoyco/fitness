import { GoogleGenAI } from '@google/genai';
import type { FoodItem, NutritionInfo } from '@/types/foodLog';

const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
});

export async function analyzeFoodImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<{ foodItems: FoodItem[]; totalCalories: number; totalNutrients: NutritionInfo }> {
  console.log('🔍 Starting food image analysis...');
  console.log('📸 Image info:', { mimeType, imageSize: imageBase64.length });

  try {
    const prompt = `Analyze this food image and provide detailed nutritional information in JSON format.

For each food item visible in the image, provide:
1. name - the name of the food item
2. calories - estimated calories
3. quantity - estimated serving size (e.g., "1 cup", "100g", "1 piece")
4. nutrients - object containing:
  - protein (g)
  - carbohydrates (g)
  - fat (g)
  - fiber (g)
  - sugar (g)
  - sodium (mg)
  - calcium (mg)
  - iron (mg)
  - vitaminA (mcg)
  - vitaminC (mg)
  - potassium (mg)

Return the response as a JSON object with this structure:
{
  "foodItems": [
    {
      "name": "string",
      "calories": number,
      "quantity": "string",
      "nutrients": {
        "protein": number,
        "carbohydrates": number,
        "fat": number,
        "fiber": number,
        "sugar": number,
        "sodium": number,
        "calcium": number,
        "iron": number,
        "vitaminA": number,
        "vitaminC": number,
        "potassium": number
      }
    }
  ]
}

Be as accurate as possible with your estimates. If you cannot identify a food item, describe it as best as you can.`;

    console.log('📤 Sending request to Gemini API...');
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType,
          },
        },
        prompt,
      ],
    });

    console.log('📥 Received response from Gemini API');
    const text = result.text;
    if (!text) {
      console.error('❌ No response text from Gemini API');
      throw new Error('No response text from Gemini API');
    }
    console.log('📝 Response text length:', text.length);

    // Extract JSON from the response (Gemini might wrap it in markdown code blocks)
    let jsonText: string = text;
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      console.log('🔧 Extracted JSON from markdown code block');
      jsonText = jsonMatch[1];
    }

    console.log('🔄 Parsing JSON response...');
    const parsed = JSON.parse(jsonText);
    const foodItems: FoodItem[] = parsed.foodItems || [];
    console.log(`✅ Parsed ${foodItems.length} food items`);

    // Calculate totals
    const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
    const totalNutrients: NutritionInfo = {
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminA: 0,
      vitaminC: 0,
      potassium: 0,
    };

    foodItems.forEach((item) => {
      if (item.nutrients) {
        totalNutrients.protein += item.nutrients.protein || 0;
        totalNutrients.carbohydrates += item.nutrients.carbohydrates || 0;
        totalNutrients.fat += item.nutrients.fat || 0;
        if (totalNutrients.fiber !== undefined) totalNutrients.fiber += item.nutrients.fiber || 0;
        if (totalNutrients.sugar !== undefined) totalNutrients.sugar += item.nutrients.sugar || 0;
        if (totalNutrients.sodium !== undefined)
          totalNutrients.sodium += item.nutrients.sodium || 0;
        if (totalNutrients.calcium !== undefined)
          totalNutrients.calcium += item.nutrients.calcium || 0;
        if (totalNutrients.iron !== undefined) totalNutrients.iron += item.nutrients.iron || 0;
        if (totalNutrients.vitaminA !== undefined)
          totalNutrients.vitaminA += item.nutrients.vitaminA || 0;
        if (totalNutrients.vitaminC !== undefined)
          totalNutrients.vitaminC += item.nutrients.vitaminC || 0;
        if (totalNutrients.potassium !== undefined)
          totalNutrients.potassium += item.nutrients.potassium || 0;
      }
    });

    console.log('✅ Food analysis complete:', {
      itemCount: foodItems.length,
      totalCalories,
      totalProtein: totalNutrients.protein,
    });
    return { foodItems, totalCalories, totalNutrients };
  } catch (error) {
    console.error('❌ Error analyzing food image:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw new Error('Failed to analyze food image. Please try again.');
  }
}
