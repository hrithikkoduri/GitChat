// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link 
                        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" 
                        rel="stylesheet" 
                    />
                    {/* You can add other meta tags, stylesheets, or scripts here */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
