import React from 'react';
import { formatCurrency, type FeeBreakdown } from '@/utils/feeCalculation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Info } from 'lucide-react';

interface FeeBreakdownDisplayProps {
  feeBreakdown: FeeBreakdown;
  title?: string;
  showInfo?: boolean;
  className?: string;
}

export const FeeBreakdownDisplay: React.FC<FeeBreakdownDisplayProps> = ({
  feeBreakdown,
  title = "Payment Breakdown",
  showInfo = true,
  className = ""
}) => {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Event Fee:</span>
            <span className="font-medium">{formatCurrency(feeBreakdown.baseFee)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Processing Charges:</span>
            <span className="font-medium text-orange-600">+ {formatCurrency(feeBreakdown.processingCharges)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Payable:</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(feeBreakdown.totalAmount)}</span>
            </div>
          </div>
        </div>
        
        {showInfo && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why processing charges?</p>
                <p>
                  Processing charges cover payment gateway fees (2.36%) to ensure 
                  the organizer receives the exact event fee amount. This way, 
                  you know exactly what you're paying for the event.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Simple inline version for smaller spaces
interface InlineFeeBreakdownProps {
  feeBreakdown: FeeBreakdown;
  showCharges?: boolean;
}

export const InlineFeeBreakdown: React.FC<InlineFeeBreakdownProps> = ({
  feeBreakdown,
  showCharges = true
}) => {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Event Fee:</span>
        <span>{formatCurrency(feeBreakdown.baseFee)}</span>
      </div>
      {showCharges && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Processing Charges:</span>
          <span className="text-orange-600">+ {formatCurrency(feeBreakdown.processingCharges)}</span>
        </div>
      )}
      <div className="flex justify-between font-medium pt-1 border-t border-border">
        <span>Total:</span>
        <span>{formatCurrency(feeBreakdown.totalAmount)}</span>
      </div>
    </div>
  );
};