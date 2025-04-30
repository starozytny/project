import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Map from "@commonFunctions/map";
import List from "@commonFunctions/list";
import Sort from "@commonFunctions/sort";
import Sanitaze from "@commonFunctions/sanitaze";

import { Pagination } from "@tailwindComponents/Elements/Pagination";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { AdsList } from "@appPages/Immo/Ads/AdsList";
import { Radiobox } from "@tailwindComponents/Elements/Fields";

const URL_GET_DATA = 'inter_api_immo_biens_list';

let mymap = null;
let markers = [];

const SESSION_FILTERS = "immopaix.filters.ads";

export class Ads extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            currentPage: 0,
            sorter: Sort.compareFinancialPriceInverse,
            loadingData: true,
            filters: List.getSessionFilters(SESSION_FILTERS, [], props.highlight),
            errors: [],
            display: 0,
            initMap: false
        }

        this.pagination = React.createRef();
    }

    componentDidMount = () => {
        this.handleGetData();
    }

    handleGetData = () => {
        const { type } = this.props;
        const { perPage, sorter, filters } = this.state;

        let url = Routing.generate(URL_GET_DATA, {type: type});
        List.getData(this, url, perPage, sorter, this.props.highlight, filters, this.handleFilters);
    }

    handleUpdateData = (currentData) => {
        this.setState({ currentData })
    }

    handleChange = (e) => {
        const { data, initMap } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "display"){
            if(parseInt(value) === 1){
                updateMarkers(initMap, data);

                this.setState({ initMap: true })
            }

            this.setState({[name]: value});
        }
    }

    handleFilter = (typeBien) => {
        const { filters, display, initMap } = this.state;

        let nFilters = [];

        let find = false;
        filters.forEach(filter => {
            if(filter === typeBien){
                find = true;
            }
        })

        if(find){
            nFilters = filters.filter(v => v !== typeBien);
        }else{
            nFilters = filters;
            nFilters.push(typeBien);
        }

        this.setState({ filters: nFilters });
        let newData = this.handleFilters(nFilters);

        if(parseInt(display) === 1){
            updateMarkers(initMap, newData);

            this.setState({ initMap: true })
        }
    }

    handleFilters = (filters, nData = null) => {
        const { dataImmuable, perPage, sorter } = this.state;
        return List.filterCustom(this, filterFunction, nData ? nData : dataImmuable, filters, perPage, sorter, SESSION_FILTERS);
    }

    handleChangeCurrentPage = (currentPage) => {
        this.setState({ currentPage });
    }

    render () {
        const { data, currentData, loadingData, perPage, currentPage, filters, display, errors } = this.state;

        let displays = [
            { value: 0, label: "Liste", identifiant: "display-list" },
            { value: 1, label: "Carte", identifiant: "display-map" },
        ];

        let typeBiens = [
            { value: 0,  identifiant: "type-bien-0", label: "Appartement" },
            { value: 1,  identifiant: "type-bien-1", label: "Maison" },
            { value: 2,  identifiant: "type-bien-0", label: "Parking/Box" },
            { value: 5,  identifiant: "type-bien-0", label: "Bureau" },
            { value: 10, identifiant: "type-bien-0", label: "Local" },
            { value: 7,  identifiant: "type-bien-0", label: "Immeuble" },
            { value: 3,  identifiant: "type-bien-0", label: "Terrain" },
            { value: 99, identifiant: "type-bien-0", label: "Fond de commerce" },
        ]

        let params0 = { errors: errors, onChange: this.handleChange };

        return <>
            <div className="bg-white">
                <section className="w-full mx-auto max-w-screen-2xl flex flex-col gap-4 px-4 pb-4 lg:px-8">
                    <div className="text-sm flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                        <div className="flex items-center gap-2">
                            <span className="icon-filter"></span>
                            <span>Filtres</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {typeBiens.map(ty => {

                                let active = false;
                                filters.forEach(f => {
                                    if (f === ty.value) {
                                        active = true;
                                    }
                                })

                                return <div className={`cursor-pointer px-4 py-2 border rounded-md ${active ? "bg-color0/80 border-color0 text-slate-50" : "bg-gray-50 hover:bg-white"}`}
                                            onClick={() => this.handleFilter(ty.value)}
                                            key={ty.value}>
                                    <div>{ty.label}</div>
                                </div>
                            })}
                        </div>
                        <div className="text-gray-600">
                            {loadingData
                                ? null
                                : <span>{data.length} résultat{data.length > 0 ? "s" : ""}</span>
                            }
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Radiobox items={displays} identifiant="display" valeur={display} {...params0} classItems="flex gap-2">
                            Affichage :
                        </Radiobox>
                    </div>
                </section>
            </div>
            <section className="w-full mx-auto max-w-screen-2xl p-4 lg:p-8">
                <div className="font-title text-color2 text-xl">Nos annonces immobilières</div>
                <div className="my-4">
                    {loadingData
                        ? <LoaderElements />
                        : <>
                            <div style={parseInt(display) === 0 ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto' }}>
                                <div id="mapid" className="h-[250px] lg:h-[350px]"></div>
                            </div>

                            {parseInt(display) === 0
                                ? <>
                                    <AdsList data={currentData} />

                                    <Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
                                                perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />
                                </>
                                : null
                            }
                        </>
                    }
                </div>
            </section>
        </>
    }
}

function filterFunction (dataImmuable, filters) {
    let newData = [];

    if (filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            newData = setNewTab("typeBien", filters, el, el.codeTypeBien, newData);
        })
    }

    return newData;
}

function setNewTab(type, filters, el, comparateur, newTable) {
    if(filters.length !== 0){
        if(type === "typeBien"){
            filters.forEach(f => {
                if(f === comparateur){
                    newTable.push(el);
                } else if(f === 10 && comparateur === 4){
                    newTable.push(el);
                } else if(f === 7 && (comparateur === 6 || comparateur === 9)){
                    newTable.push(el);
                } else if((f === 1 || f === 3) && comparateur === 8){
                    newTable.push(el);
                } else if(f === 0 && comparateur === 11){
                    newTable.push(el);
                } else if(f === 99 && el.codeTypeAd === 7){
                    newTable.push(el);
                }
            })
        }
    }else{
        newTable.push(el)
    }

    return newTable;
}

function updateMarkers (initMap, data) {
    if(initMap){
        if(mymap){
            mymap.remove();
        }
    }

    mymap = Map.createMap(43.297648, 5.372835, 15, 13, 22);

    let latLngs = [];
    data.forEach(elem => {
        if(elem.localisation && elem.localisation.lat && elem.localisation.lon){
            let latLon = [elem.localisation.lat, elem.localisation.lon];
            let marker = L.marker(latLon, {icon: Map.getOriginalLeafletIcon("../")}).addTo(mymap);

            // let href = "href='"+ Routing.generate(URL_READ_ELEMENT, {
            //     'type': elem.codeTypeAd === 1 ? 'locations' : 'ventes',
            //     'codeSociety': elem.agency.code,
            //     'slug': elem.slug,
            // }) +"'";
            let href = ""

            marker.bindPopup("<a "+ href +" class='popmap-item'>" +
                "<img src='"+ elem.mainPhotoFile +"' alt='Image annonce'>" +
                "<div class='popmap-item-infos'>" +
                "<div class='label'>" + elem.libelle + "</div>" +
                "<div class='address'>" + elem.localisation.zipcode + ", " + elem.localisation.city + "</div>" +
                "<div class='grp-price'><span class='price'>"+Sanitaze.toFormatCurrency(elem.financial.price) + "</span>" + (elem.codeTypeAd !== 1 ? "" : " cc/mois") + "</div>" +
                "</div>" +
                "</a>");
            latLngs.push(latLon)
        }
    })

    if(latLngs.length !== 0){
        if(markers.length !==0){
            markers.forEach(m => {
                mymap.removeLayer(m);
            })

            markers = [];
        }
        let markerBounds = L.latLngBounds(latLngs);
        mymap.fitBounds(markerBounds);
        markers.push(markerBounds);
    }
}
