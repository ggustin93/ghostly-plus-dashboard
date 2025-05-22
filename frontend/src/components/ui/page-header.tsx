import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-left">{title}</h1>
      <p className="text-muted-foreground text-left">{description}</p>
    </div>
  );
};

export default PageHeader; 