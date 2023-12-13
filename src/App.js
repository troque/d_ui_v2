import React, { Suspense } from 'react';

import './App.css';
import DefaultLayout from './layout/DefaultLayout';

function App() {

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DefaultLayout />
    </Suspense>
  );

}


export default App;
