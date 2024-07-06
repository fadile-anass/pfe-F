import styled from 'styled-components';
import { Button } from '@mui/material';

export const RedButton = styled(Button)`
  && {
    background-color: #f00; /* Rouge */
    color: white; /* Blanc */
    margin-left: 4px;
    &:hover {
      background-color: #eb7979; /* Rouge foncé */
      border-color: #f26767; /* Rouge légèrement plus clair */
      box-shadow: none;
    }
  }
`;

export const BlackButton = styled(Button)`
  && {
    background-color: #000000; /* Noir */
    color: white; /* Blanc */
    margin-left: 4px;
    &:hover {
      background-color: #212020; /* Noir plus foncé */
      border-color: #212020;
      box-shadow: none;
    }
  }
`;

export const DarkRedButton = styled(Button)`
  && {
    background-color: #650909; /* Rouge foncé */
    color: white; /* Blanc */
    &:hover {
      background-color: #eb7979; /* Rouge foncé */
      border-color: #f26767; /* Rouge légèrement plus clair */
      box-shadow: none;
    }
  }
`;

export const BlueButton = styled(Button)`
  && {
    background-color: #080a43; /* Bleu foncé */
    color: #fff; /* Blanc */
    &:hover {
      background-color: #0a1e82; /* Bleu plus foncé */
    }
  }
`;

export const PurpleButton = styled(Button)`
  && {
    background-color: #270843; /* Violet */
    color: #fff; /* Blanc */
    &:hover {
      background-color: #3f1068; /* Violet foncé */
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  && {
    background-color: #7f56da; /* Violet clair */
    color: #fff; /* Blanc */
    &:hover {
      background-color: #7a1ccb; /* Violet foncé */
    }
  }
`;

export const GreenButton = styled(Button)`
  && {
    background-color: #133104; /* Vert foncé */
    color: #fff; /* Blanc */
    &:hover {
      background-color: #266810; /* Vert plus foncé */
    }
  }
`;

export const BrownButton = styled(Button)`
  && {
    background-color: #2c1006; /* Marron */
    color: white; /* Blanc */
    &:hover {
      background-color: #40220c; /* Marron foncé */
      border-color: #40220c;
      box-shadow: none;
    }
  }
`;

export const IndigoButton = styled(Button)`
  && {
    background-color: #2f2b80; /* Indigo */
    color: white; /* Blanc */
    &:hover {
      background-color: #534ea6; /* Indigo foncé */
      border-color: #473d90; /* Indigo légèrement plus clair */
      box-shadow: none;
    }
  }
`;
