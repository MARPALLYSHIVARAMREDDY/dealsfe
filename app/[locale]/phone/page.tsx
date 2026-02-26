"use client";

import { useState, useRef } from 'react';
import { PhoneInput, PhoneInputRef } from '@/components/phone-input';
import { Button } from '@/components/ui/button';

export default function PhonePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const phoneRef = useRef<PhoneInputRef>(null);

  const handleSubmit = () => {
    setSubmitted(true);
    setApiError(''); // Clear any previous API errors

    // Validate using ref
    if (phoneRef.current?.validate()) {
      const e164Number = phoneRef.current.getValue();
      console.log('Valid phone number:', e164Number);

      // Simulate API call
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate an error for a specific number
      if (e164Number === '+11234567890') {
        setApiError('This phone number is already registered');
      } else {
        alert(`Success! Phone number: ${e164Number}`);
      }
    }
  };

  const handleClear = () => {
    phoneRef.current?.clear();
    setPhoneNumber('');
    setApiError('');
    setSubmitted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Phone Input Demo</h1>
          <p className="text-muted-foreground">
            Test the phone input component with international validation
          </p>
        </div>

        <div className="space-y-4">
          <PhoneInput
            ref={phoneRef}
            value={phoneNumber}
            onChange={setPhoneNumber}
            error={apiError}
            shouldValidate={submitted}
            defaultCountry="us"
            label="Phone Number"
            placeholder="Enter your phone number"
            required
          />

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Submit
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h2 className="font-semibold">Current Value:</h2>
          <code className="block bg-background p-2 rounded text-sm">
            {phoneNumber || '(empty)'}
          </code>

          <h2 className="font-semibold mt-4">Features:</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Country dropdown with search</li>
            <li>Auto-detect country from typed number</li>
            <li>Validation triggers on blur</li>
            <li>Real-time validation after first trigger</li>
            <li>Returns E164 format (+15551234567)</li>
            <li>Matches shadcn/ui Input styling</li>
          </ul>

          <h2 className="font-semibold mt-4">Try:</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Enter +11234567890 to see API error</li>
            <li>Leave field empty and submit</li>
            <li>Type incomplete number and blur</li>
            <li>Switch countries mid-input</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
