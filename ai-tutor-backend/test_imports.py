import sys
print("Python path:", sys.path)
print("\n" + "="*50)

try:
    from app.core.config import settings
    print("✅ Settings imported successfully!")
    print(f"   APP_NAME: {settings.APP_NAME}")
    print(f"   GROQ_API_KEY: {settings.GROQ_API_KEY[:10]}..." if settings.GROQ_API_KEY else "   GROQ_API_KEY: NOT SET")
except Exception as e:
    print(f"❌ Error importing settings: {e}")
    import traceback
    traceback.print_exc()