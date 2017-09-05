package com.sap.pia.producer;

import java.sql.SQLException;
import java.util.Properties;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.odata4j.producer.ODataProducer;
import org.odata4j.producer.ODataProducerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UsageCloudProducerFactory implements ODataProducerFactory
{

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(UsageCloudProducerFactory.class);

	/**
	 * create method used to create instance of OdataProducer.
	 * 
	 * @param properties
	 *            properties value.
	 * @return
	 *			  Return ODataProducer object.
	 */
	public ODataProducer create(Properties properties)
	{

		JdbcDataProducer jdbcDataProducer= null;
		try
		{
			jdbcDataProducer= new JdbcDataProducer();
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		return jdbcDataProducer;
	}
}
