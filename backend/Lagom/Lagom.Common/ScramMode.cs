namespace Lagom.Common
{
    public static class ScramMode
    {
        private static bool _activated = false;
        public static bool IsActivated => _activated;

        // Only an authenticated admin should call these
        public static void Activate() => _activated = true;
        public static void Deactivate() => _activated = false;
    }

}
