import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FAQ from './FAQ';

test('should toggle accordion items', () => {
  render(<FAQ />);

  const accordionItems = [
    { header: 'למה בכלל מסירים קעקוע?', body: 'הרבה מאיתנו עשינו קעקועים בגיל צעיר...' },
    { header: 'כמה זמן לוקח תהליך הסרת קעקוע?', body: 'זמן התהליך תלוי בהרבה גורמים...'},
    { header: 'מהי הסרה של קעקוע / איפור קבוע?', body: 'הסרת הקעקוע מגוף עד להיעלמותו,...'},
    { header: 'האם זה כואב?', body:'לא! במהלך הטיפול האזור מקורר לטמפרטורה...'},
    { header: 'האם נשארות צלקות?', body:'אני שמחה לומר ש- לא!...'},
    { header: 'כמה טיפולים?', body:'כמות הטיפולים תלויה בהרבה...'}
      
  ];

  accordionItems.forEach(({ header,body }) => {
    const accordionHeader = screen.getByText(header);
    expect(accordionHeader).toBeInTheDocument();

    fireEvent.click(accordionHeader);

    const accordionBody = screen.getByText(new RegExp(body, 'i')); // Use regular expression matcher  
    expect(accordionBody).toHaveStyle({ display: 'block' }); // Use toHaveStyle matcher


    fireEvent.click(accordionHeader);
    expect(accordionBody).toHaveStyle({ display: 'block' }); // Use toHaveStyle matcher
  });
  
});