import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@material-ui/core';

import styles from './styles.module.scss';

type subMenuProps = {
    item: navItem;
}

type navItem = {
    title: string;
    path: string,
    icon: JSX.Element;
    iconClosed: JSX.Element;
    iconOpened: JSX.Element;
    subNav: subnavItem[];
};

type subnavItem = {
    title: string;
    icon: JSX.Element;
    path: string;
};

export default function Submenu ({ item }: subMenuProps): JSX.Element {
    const router = useRouter();

    const [subnav, setSubnav] = useState(false);

    console.log(item);
  
    function toggleSubnav() {
        setSubnav(!subnav);
    } 

    function redirect(link: string) {
        router.push(link);
    }
  
    return (
      <>
        <Button onClick={item.subNav && toggleSubnav} style={{width: '100%'}}>
            <div className={styles.sidebarLink}>
                <div>
                    {item.icon}
                    <span>{item.title}</span>
                </div>
                <div className={styles.arrowDrop}>
                    {item.subNav && subnav
                    ? item.iconOpened
                    : item.subNav
                    ? item.iconClosed
                    : null}
                </div>
            </div>
        </Button>
            {subnav &&
                item.subNav.map((item: subnavItem, index: number) => {
                    return (
                        <div className={styles.dropdown} key={index}>
                            <Button onClick={() => redirect(item.path)} >
                                {item.icon}
                            <span>{item.title}</span>
                            </Button>
                        </div>
                    );
                })
            }
      </>
    );
}
