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
                icon: <MI.Dashboard />,
            },
            {
                title: 'Listagem de usuários',
                path: '/ListPersons',
                icon: <MI.List />,
            },
            {
                title: 'Registrar usuários',
                path: '/RegisterPersons/-1',
                icon: <MI.Person />,
            },
        ],
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
                icon: <MI.List />,
            },
            {
                title: 'Criação de Projetos',
                path: '/RegisterProjects/-1',
                icon: <MI.LibraryAdd />,
            },
            {
                title: 'Projetos pendentes',
                path: '/PendingProjects',
                icon: <MI.RateReview />,
            },
            {
                title: 'Projetos aprovados',
                path: '/ApprovedProjects',
                icon: <MI.RateReview />,
            },
            {
                title: 'Projetos em execução',
                path: '/RunningProjects',
                icon: <MI.RateReview />,
            },
            {
                title: 'Projetos finalizados',
                path: '/FinishedProjects',
                icon: <MI.List />,
            },
            {
                title: 'Projetos cancelados',
                path: '/CancelledProjects',
                icon: <MI.List />,
            },
        ],
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
                title: 'Listagem de Unidades',
                path: '/ListUnities',
                icon: <MI.List />,
            },
            {
                title: 'Criação de Critérios',
                path: '/RegisterCriteria/-1',
                icon: <MI.RateReview />,
            },
            {
                title: 'Projetos a serem avaliados',
                path: '/ListRegisteredProjects',
                icon: <MI.RateReview />,
            },
            {
                title: 'Aprovação de projetos',
                path: '/AcceptProjects',
                icon: <MI.RateReview />,
            },
        ],
    },
];
