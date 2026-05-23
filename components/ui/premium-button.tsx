import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  loadingText?: string
}

export function PremiumButton({ 
  loading, 
  loadingText, 
  disabled, 
  children, 
  className, 
  ...props 
}: PremiumButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:hover:scale-100 disabled:active:scale-100",
        className
      )}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      <span className={cn("transition-opacity duration-200", loading && "opacity-0")}>
        {loading ? loadingText : children}
      </span>
    </Button>
  )
}
