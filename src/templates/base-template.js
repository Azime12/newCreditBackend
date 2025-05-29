module.exports = (options) => {
    const {
      title,
      greeting = 'Hello,',
      content,
      primaryColor = '#0ca197',
      logoUrl,
      brandName = process.env.APP_NAME || 'OurApp',
      cta,
      footerLinks = [
        { text: 'Privacy Policy', url: `${process.env.FRONTEND_URL}/privacy` },
        { text: 'Contact Us', url: `${process.env.FRONTEND_URL}/contact` }
      ]
    } = options;
  
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { max-height: 50px; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: ${primaryColor}; 
          color: white !important; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: bold; 
        }
        .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoUrl ? `<img src="${logoUrl}" alt="${brandName}" class="logo">` : `<h2>${brandName}</h2>`}
      </div>
      
      <h2>${title}</h2>
      <p>${greeting}</p>
      ${content}
      
      ${cta ? `<p><a href="${cta.url}" class="button">${cta.text}</a></p>` : ''}
      
      <div class="footer">
        ${footerLinks.map(link => `<a href="${link.url}" style="color: ${primaryColor}; margin: 0 10px;">${link.text}</a>`).join('')}
        <p>© ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
      </div>
    </body>
    </html>
    `;
  };