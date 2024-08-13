import React, { useState } from 'react';
import axios from 'axios';

const Simulation = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('https://gal-lavi-y3cegxkuhq-zf.a.run.app/process_image', formData);
      setOutput(response.data.output);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>הדמיה להסרת קעקוע</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {preview && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', height: '100%', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4>תמונה לפני עיבוד</h4>
            <img src={preview} alt="Uploaded" style={{ width: '350px', height: '350px', objectFit: 'cover' }} />
          </div>
          {loading ? (
            <p>אנא המתן</p>
          ) : output && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '100px' }}>🠔</div>
                <p style={{textAlign: 'center', maxWidth: '250px'}}>
                  <strong>התמונה להמחשה בלבד!</strong><br/>
                  אנו משתמשים בטכנולוגיית בינה מלאכותית מתקדמת כדי להדמות את התמונה שלך לאחר הסרת הקעקוע. עם זאת, ייתכן והתהליך לא תמיד מדויק וייתכן ויהיו שגיאות. אנו ממשיכים לשפר את השירות שלנו ואנו מעריכים את ההבנה שלך.
                </p>
            </div>
          )}
          {output && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4>תמונה לאחר עיבוד</h4>
              <img src={`data:image/jpeg;base64,${output}`} alt="Processed output" style={{ width: '350px', height: '350px', objectFit: 'cover' }}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Simulation;
