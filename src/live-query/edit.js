import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, TextControl, SelectControl, CheckboxControl, TextareaControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
import { useEffect, useState } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'core/group', { layout: { type: "flex", flexWrap: "nowrap", justifyContent: "center" } }, [
		[ 'scm/live-filters', {} ]
	] ],
	[ 'scm/live-posts', {} ],
	[ 'core/group', { layout: { type: "flex", flexWrap: "nowrap", justifyContent: "center" } }, [
		[ 'scm/live-more', {} ]
	] ],
];

export default function Edit( { attributes, setAttributes } ) {
	const { postType, limit, rootURL, params } = attributes;
	const [ postTypeOptions, setPostTypeOptions ] = useState( null );
	const [ paramsError, setParamsError ] = useState( '' );
	// const [ taxonomies, setTaxonomies ] = useState( null );
	// const [ taxonomyOptions, setTaxonomyOptions ] = useState( null );
	// const [ postTypes, setPostTypes ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/types' } ).then( ( types ) => {
			if( types ) {
				let typesSelect = [
					{ value: '', label: 'Select a Post Type', disabled: true }
				];
				for( const key in types ) {
					if( types.hasOwnProperty( key ) ) {
						typesSelect.push( { label: types[key].name, value: types[key].slug } );
					}
				}
				setPostTypeOptions( typesSelect );
			}
		} );
	}, [] );
			
	const updatePostType = ( newType ) => {
		setAttributes( { postType: newType } );
	}

	const updateParams = ( newParams ) => {
		setAttributes( { params: newParams } );
		try {
			JSON.parse( newParams || '{}' );
			setParamsError( '' );
		} catch ( e ) {
			setParamsError( __( 'Invalid JSON' ) );
		}
	}

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					{ postTypeOptions && (
						<SelectControl
							label="Post type"
							value={ postType }
							options={ postTypeOptions }
							onChange={ ( newType ) => updatePostType( newType ) }
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) }
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						type="number"
						label="Post limit"
						value={ limit }
						onChange={ ( newLimit ) => setAttributes( { limit: parseInt( newLimit ) } ) }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						type="text"
						label="Root URL"
						help={ __( 'Optional. Overrides the REST API root URL used by this block on the frontend.' ) }
						value={ rootURL }
						onChange={ ( newRootURL ) => setAttributes( { rootURL: newRootURL } ) }
					/>
					<TextareaControl
						__nextHasNoMarginBottom
						label="Additional params"
						value={ params }
						onChange={ updateParams }
						help={ paramsError || 'JSON object of additional params to send with API requests' }
						rows={ 4 }
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks template={ TEMPLATE } />
		</div>
	);
}