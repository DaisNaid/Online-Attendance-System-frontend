import React from 'react';
import Container from 'react-bootstrap/esm/Container';

export default function NoPageScreen() {
  return (
    <Container className="site-container">
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1>
              4<span>0</span>4
            </h1>
          </div>
          <h2>The Page You Requested Could Not Be Found</h2>
        </div>
      </div>
    </Container>
  );
}
