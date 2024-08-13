import React from 'react'
import { Container, Row, Accordion } from 'react-bootstrap';
import '../css/faq.css';

function FAQ() {
  return (
    <Container>
        <Row >
            <Accordion className='mt-5 p-3'>
           
                <Accordion.Item eventKey = '0' className = 'item'>
                    <Accordion.Header>למה בכלל מסירים קעקוע? </Accordion.Header>
                    <Accordion.Body className='body'>
                        הרבה מאיתנו עשינו קעקועים בגיל צעיר והחלטנו שזה לא מתאים לנו יותר או שהתקעקענו אצל האדם הלא נכון שפגע בעורנו, יש מי מאיתנו שרצינו גבות מלאות יותר ארוכות יותר עבות יותר , וקיעקוע הגבות לא יצא מה שרצינו, לא סימטרי, לא מתאים לפנים שלנו, הרבה מאיתנו פשוטים לא מרוצים מהתוצאות ולכן אין סיבה יותר שנפגע באיכות חיינו ובאהבה שלנו לעצמנו, אפשר להסיר את הקעקוע, האיפור הקבוע או הגבות הקבועות
                    </Accordion.Body>                    
                </Accordion.Item>
                <Accordion.Item eventKey = '1' className = 'item'>
                    <Accordion.Header> כמה זמן לוקח תהליך הסרת קעקוע?</Accordion.Header>
                    <Accordion.Body className='body'>
                        זמן התהליך תלוי בהרבה גורמים ומשתנים הקשורים בקעקוע עצמו ובעור המטופל/ת, זמן התהליך אורך בהתאם לכמות הטיפולים הנדרשת לאחר שכלול הפרמטרים הנדרשים, ובנוסף ישנו פרק זמן בין טיפול לטיפול, בין 3-4 חודשים בהם הגוף ממשיך את תהליך הפירוק
                    </Accordion.Body >                    
                </Accordion.Item>
                <Accordion.Item eventKey = '2' className = 'item'>
                    <Accordion.Header> מהי הסרה של קעקוע / איפור קבוע? </Accordion.Header>
                    <Accordion.Body className='body'>
                        הסרת הקעקוע מגוף עד להיעלמותו, באמצעות שימוש במכונת לייזר מתקדמת המפרקת את הקעקוע לחלקיקים זעירים אשר הגוף יכול לסלק בעצמו. (בדומה לשואב אבק שיכול לשאוב חול ולא אבנים גדולות)
                    </Accordion.Body>                    
                </Accordion.Item>
                <Accordion.Item eventKey = '3' className = 'item'>
                    <Accordion.Header> האם זה כואב? </Accordion.Header>
                    <Accordion.Body className='body'>
                        לא! במהלך הטיפול האזור מקורר לטמפרטורה מאד נמוכה והאזור מאולחש ולכן הכאב איננו מורגש
                    </Accordion.Body>                    
                </Accordion.Item>
                <Accordion.Item eventKey = '4' className = 'item'>
                    <Accordion.Header> האם נשארות צלקות? </Accordion.Header>
                    <Accordion.Body className='body'>
                        אני שמחה לומר ש- לא! אחד היתרונות הבולטים של הטכנולוגיה ‘פיקו לייזר’, שהיא עובדת ע”י גלים אוקסטיים ולא חום כבד , דבר המונע הצטלקות ופגיעה בעור, בנוסף אני מתמקצעת בתחום ההסרה וידיי מיומנות, ובאמצעות עבודה נכונה ובטוחה - העור לא מצטלק או נכווה ולא נשארים סימנים
                    </Accordion.Body>                    
                </Accordion.Item>
                <Accordion.Item eventKey = '5' className = 'item'>
                    <Accordion.Header> כמה טיפולים? </Accordion.Header>
                    <Accordion.Body className='body'>
                        כמות הטיפולים תלויה בהרבה פרמטרים ומשתנים, בנוסף קיים הבדל בין הסרת קעקוע לבין הסרת איפור קבוע או גבות קבועות, לרוב הסרת קעקוע להיעלמותו יארך 4-7 טיפולים. לרוב הסרת גבות קבועות או איפור קבוע יצריך 3-5 טיפולים, ושוב נדגיש כי לכל מטופל/ת תקבע תוכנית טיפולים ובה יוגדר התהליך וכמות הטיפולי בהתאם לפרמטרים המדוייקיםכגון: חילוף חומרים, כמות שתייה, הקפדה על ההוראות לאחר טיפול, סוג הדיו של הקעקוע
                    </Accordion.Body>                    
                </Accordion.Item>

            </Accordion>
        </Row>
    </Container>
  )
}

export default FAQ;



