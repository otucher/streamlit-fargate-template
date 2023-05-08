# -*- coding: utf-8 -*-
import logging
from pathlib import Path
from io import BytesIO

import streamlit as st

from src import __version__

LOGGER = logging.getLogger('src.main')
HERE = Path(__file__).parent.resolve()


def main():
    # use card image and application name as tab image and header
    st.set_page_config(
        layout="wide",
        page_icon=BytesIO(HERE.parent.joinpath('favicon.ico').read_bytes()),
        page_title="{{cookiecutter.display_name}}"
    )

    # set custom css
    custom_css = HERE.joinpath("streamlit.css").read_text()
    st.markdown(f'<style>{custom_css}</style>', unsafe_allow_html=True)

    # setup logging
    logging.basicConfig(level='DEBUG')
    LOGGER.debug('Starting {{cookiecutter.display_name}}')
    LOGGER.debug(f'Version: {__version__}')

    # write app
    st.title("{{cookiecutter.display_name}}")
    st.write("Hello World")


if __name__ == '__main__':
    main()
