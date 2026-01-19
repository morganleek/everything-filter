import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'; // InspectorControls, 
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import './editor.scss';

const TEMPLATE = [
	[ 'core/post-template', {}, [
		[ 'core/post-title', {} ]
	] ]
];

export default function Edit( { attributes: { content }, setAttributes, insertBlocksAfter } ) {
	return (
		<div { ...useBlockProps() }>
			<InnerBlocks template={ TEMPLATE } />
		</div>
	);
}