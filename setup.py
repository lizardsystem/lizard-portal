from setuptools import setup

version = '0.63.2.dev0'

long_description = '\n\n'.join([
    open('README.rst').read(),
    open('TODO.rst').read(),
    open('CREDITS.rst').read(),
    open('CHANGES.rst').read(),
    ])

install_requires = [
    'dbfpy',
    'Django',
    'django-extensions',
    'django-nose',
    'lizard-ui >= 3.0',
    'pkginfo',
    'lizard-geo',
    'lizard-area >= 0.9.4',
    'lizard-registration',
    'lizard-security',
    'lizard-task',
    ],

tests_require = [
    ]

setup(name='lizard-portal',
      version=version,
      description="TODO",
      long_description=long_description,
      # Get strings from http://www.python.org/pypi?%3Aaction=list_classifiers
      classifiers=['Programming Language :: Python',
                   'Framework :: Django',
                   ],
      keywords=[],
      author='Gijs Nijholt',
      author_email='gijs.nijholt@nelen-schuurmans.nl',
      url='',
      license='GPL',
      packages=['lizard_portal'],
      include_package_data=True,
      zip_safe=False,
      install_requires=install_requires,
      tests_require=tests_require,
      extras_require = {'test': tests_require},
      entry_points={
          'console_scripts': [
          ]},
      )
