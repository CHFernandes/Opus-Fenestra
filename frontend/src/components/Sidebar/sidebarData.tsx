import React from 'react';

import * as MI from '@material-ui/icons/';

const closedIcon = <MI.ExpandMore />;
const openedIcon = <MI.ExpandLess />;

export const SidebarData = [
    {
      title: 'Organização',
      path: '/#',
      icon: <MI.Business />,
      iconClosed: closedIcon,
      iconOpened: openedIcon,

      subNav: [
        {
          title: 'Dashboard',
          path: '/Dashboard',
          icon: <MI.Dashboard />
        },
      ]
    },
    {
      title: 'Projetos',
      path: '/#',
      icon: <MI.Assignment />,
      iconClosed: closedIcon,
      iconOpened: openedIcon,
  
      subNav: [
        {
          title: 'Listagem de Projetos',
          path: '/ListProjects',
          icon: <MI.List />
        },
        {
          title: 'Criação de Projetos',
          path: '/RegisterProjects/-1',
          icon: <MI.LibraryAdd />
        }
      ]
    },
    {
      title: 'Avaliação',
      path: '/#',
      icon: <MI.Assessment />,
      iconClosed: closedIcon,
      iconOpened: openedIcon,
  
      subNav: [
        {
          title: 'Listagem de Critérios',
          path: '/ListCriteria',
          icon: <MI.List />,
        },
        {
          title: 'Criação de Critérios',
          path: '/RegisterCriteria/-1',
          icon: <MI.RateReview />,
        },
      ]
    },    
];