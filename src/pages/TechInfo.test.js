import React from 'react';
import { render, screen } from '@testing-library/react';
import TechInfo from './TechInfo';
import '@testing-library/jest-dom/extend-expect';

test('Renders TechInfo page and it\'s items correctly', () => {
  render(<TechInfo />);
  const paragraphs = screen.getAllByText(/המכונה/i);
  expect(paragraphs).toHaveLength(3);
  expect(paragraphs[0]).toHaveTextContent(
    'המכונה בה אני משתמשת בעלת אישור משרד הבריאות ומכון התקנים.'
  );
  expect(paragraphs[1]).toHaveTextContent(
    'המכונה בעלת טכנולוגיה עכשווית המאפשרת לי לעבוד עם כל גווני העור ולהסיר את כל סוגי הקעקועים, ובעיקר להצליח להגיד כן! ולעזור לכל מי שרוצה להסיר כל סוג של קעקוע, ביעילות ובפשטות, במעט טיפולים ביחס למכונות הישנות יותר. (למעט צבעי סגול כחול ירוק וצהוב).'
  )
  
  //renders the list items correctly
  const listItems = screen.getAllByRole('listitem');
  expect(listItems).toHaveLength(6);
  expect(listItems[0]).toHaveTextContent('טיפול יעיל קרן הלייזר בעלת טווח רחב ועמוק');

  //renders the image correctly
  const image = screen.getByAltText('1');
  expect(image).toBeInTheDocument();

  //renders the list items in the correct order
  const expectedItems = [
    'טיפול יעיל קרן הלייזר בעלת טווח רחב ועמוק',
    'טיפול איכותי במכונת הלייזר המתקדמת בעולם',
    'טכנולוגיה מתקדמת , ככל שהפולס מהיר יותר הוא מפרק את הפיגמנט לחלקיק קטן יותר,',
    'טכנולוגיה פורצת דרך המתבצעת ע”י גלים אקוסטיים ולכן פירוק הפיגמנט נעשה טיפול יחיד יעיל יותר ואף יותר ממכונות הפועלות ע”י חום בלבד.',
    'חסכון בזמן ובטיפולים',
    'מינימום כאב מאחר והמכונה מקררת'

  ];
  
expect(listItems).toHaveLength(expectedItems.length);

listItems.forEach((listItem, index) => {
  expect(listItem).toHaveTextContent(expectedItems[index]);
});
});
