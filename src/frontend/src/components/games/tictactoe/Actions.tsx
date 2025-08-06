import React from 'react';

type GameActionsProps = {
  actions: {
    label: string;
    onClick: () => void;
    color?: string;
    disabled?: boolean;
    primary?: boolean;
  }[];
};

const Actions = ({ actions }: GameActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      {actions.map((action, index) => {
        let buttonClass = action.primary
          ? "bg-blue-500 hover:bg-blue-600" 
          : "bg-gray-700 hover:bg-gray-600";
          
        if (action.color) {
          switch(action.color) {
            case "green":
              buttonClass = "bg-green-500 hover:bg-green-600";
              break;
            case "red":
              buttonClass = "bg-red-500 hover:bg-red-600";
              break;
            case "purple":
              buttonClass = "bg-purple-500 hover:bg-purple-600";
              break;
          }
        }
        
        if (action.disabled) {
          buttonClass += " opacity-50 cursor-not-allowed";
        } else {
          buttonClass += " transition-colors";
        }
        
        return (
          <button 
            key={index}
            className={`${buttonClass} text-white font-bold py-2 px-6 rounded`}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

export default Actions;