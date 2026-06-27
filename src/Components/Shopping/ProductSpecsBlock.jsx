import React from 'react';

const ProductSpecsBlock = ({ features = [], specs = {} }) => {
  // Early rendering return layout if both data structures are completely empty to avoid spacing gaps
  if (!features.length && !Object.keys(specs).length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
      {/* Dynamic Key Features List Column */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          Top Features
        </h3>
        {features.length > 0 ? (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✔</span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-400 italic">No special features listed.</p>
        )}
      </div>

      {/* Dynamic Technical Specifications Key-Value Column */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          Technical Specs
        </h3>
        {Object.keys(specs).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(specs).map(([key, value]) => (
              <div
                key={key}
                className="text-sm grid grid-cols-[120px_1fr] gap-4 border-b border-gray-50 pb-2 items-start"
              >
                {/* Sanitizes raw keys from database formatting */}
                <span className="text-gray-400 font-medium capitalize whitespace-nowrap">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-gray-900 font-bold text-right lg:text-left break-words">
                  {value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No technical specifications provided.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSpecsBlock;
