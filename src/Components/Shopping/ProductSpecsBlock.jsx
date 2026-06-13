import React from 'react';

const ProductSpecsBlock = ({ features = [], specs = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          Top Features
        </h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✔</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          Technical Specs
        </h3>
        <div className="space-y-3">
          {Object.entries(specs).map(([key, value]) => (
            <div
              key={key}
              className="text-sm grid grid-cols-[100px_1fr] gap-4 border-b border-gray-50 pb-2 items-start"
            >
              <span className="text-gray-400 font-medium whitespace-nowrap">{key}</span>
              <span className="text-gray-900 font-bold text-right lg:text-left">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSpecsBlock;
