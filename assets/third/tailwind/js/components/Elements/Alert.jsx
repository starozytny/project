import React from "react";
import PropTypes from 'prop-types';

export function Alert ({ type, icon, title, children })
{
    const typeVariants = {
        blue: 'bg-blue-50 text-blue-700',
        red: 'bg-red-50 text-red-700',
        gray: 'bg-gray-50 text-gray-700',
    }

    return <div className={`flex flex-row gap-4 ${typeVariants[type]} rounded-md p-6 xl:p-4`}>
        {icon
            ? <div><span className={`icon-${icon} inline-block align-middle`}></span></div>
            : null
        }
        <div>
            {title
                ? <div className="font-semibold mb-2 xl:mb-0">{title}</div>
                : null
            }
            <div className="leading-8">{children}</div>
        </div>
    </div>
}

Alert.propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string,
    ring: PropTypes.bool,
}
