
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AssessmentQuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface AssessmentQuestionProps {
  question: string;
  options: AssessmentQuestionOption[];
  selectedValue: string | undefined;
  onSelect: (value: string) => void;
}

const AssessmentQuestion: React.FC<AssessmentQuestionProps> = ({
  question,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <>
      <h2 className="text-xl font-medium mb-4">{question}</h2>
      
      <RadioGroup 
        value={selectedValue}
        onValueChange={onSelect}
        className="space-y-3"
      >
        {options.map((option) => (
          <div 
            key={option.id} 
            className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 hover:border-indigo transition-colors"
          >
            <RadioGroupItem value={option.value} id={option.id} className="text-indigo" />
            <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};

export default AssessmentQuestion;
