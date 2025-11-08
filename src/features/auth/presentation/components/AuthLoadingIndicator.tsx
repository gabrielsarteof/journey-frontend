import { useAuthStore } from '../../application/stores/authStore';

export const AuthLoadingIndicator = () => {
  const { isLoading } = useAuthStore();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-secondary h-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary animate-pulse" />
        <div
          className="absolute h-full bg-white/30 animate-[slide_1.5s_ease-in-out_infinite]"
          style={{
            width: '30%',
            animation: 'slide 1.5s ease-in-out infinite',
          }}
        />
      </div>

      <style>
        {`
          @keyframes slide {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(400%);
            }
          }
        `}
      </style>
    </div>
  );
};
